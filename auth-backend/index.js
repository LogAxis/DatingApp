const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');  // Declare JWT once

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'auth_db',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Listen on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// Register a new user
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password and save the user
    const hashedPassword = bcrypt.hashSync(password, 8);
    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error registering user' });

      const userId = results.insertId;

      // Generate JWT token with user ID
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token });
    });
  });
});

// Login user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];

    // Check password
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token with user ID
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  });
});

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);  // No token, unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);  // Invalid token, forbidden

    req.user = user;  // Attach the user (with ID) to the request object
    next();  // Continue to the next middleware or route
  });
};

// Secure dashboard route
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// POST route to add interests to user's profile
app.post('/users/interests', authenticateToken, (req, res) => {
  const userId = req.user.id;  // Assuming authenticateToken middleware adds the user info
  const selectedInterests = req.body.interests;  // Array of interest IDs

  if (!selectedInterests || selectedInterests.length === 0) {
    return res.status(400).json({ message: 'No interests selected' });
  }

  // First, delete any existing interests for the user
  db.query('DELETE FROM user_interests WHERE user_id = ?', [userId], (err) => {
    if (err) {
      console.error('Error clearing previous interests:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Insert the new selected interests
    const values = selectedInterests.map(interestId => [userId, interestId]);
    const query = 'INSERT INTO user_interests (user_id, interest_id) VALUES ?';

    db.query(query, [values], (err) => {
      if (err) {
        console.error('Error saving interests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.json({ message: 'Interests saved successfully!' });
    });
  });
});

// POST route to handle profile completion
app.post('/users/profile-completion', authenticateToken, (req, res) => {
  const userId = req.user.id;  // Get user ID from the decoded token
  const { bio, age, gender, location } = req.body;

  // Update the user’s profile in the database
  const updateUserQuery = `
    UPDATE users 
    SET bio = ?, age = ?, gender = ?, location = ? 
    WHERE id = ?`;

  db.query(updateUserQuery, [bio, age, gender, location, userId], (err) => {
    if (err) {
      console.error('Error updating user profile:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json({ message: 'Profile updated successfully!' });
  });
});

// Route to fetch interests
app.get('/interests', (req, res) => {
  const query = 'SELECT * FROM interests';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching interests:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// Route to fetch matches based on similar interests
app.get('/users/matches', authenticateToken, (req, res) => {
  const userId = req.user.id;  // Get the logged-in user's ID

  const query = `
    SELECT u.id, u.name, u.bio, u.created_at, u.profile_picture
    FROM users u
    JOIN user_interests ui1 ON u.id = ui1.user_id
    JOIN user_interests ui2 ON ui1.interest_id = ui2.interest_id
    WHERE ui2.user_id = ?
      AND u.id != ?  -- Exclude the logged-in user
    GROUP BY u.id
    ORDER BY u.created_at DESC;  -- Sort by latest registered users
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching matches:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(results);  // Return the matched users
  });
});

// Fetch the current user's profile and their selected interests
app.get('/users/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Fetch user's profile information
  const userQuery = `
    SELECT id, name, email, bio, age, gender, location FROM users WHERE id = ?
  `;
  
  db.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Fetch user's selected interests
    const interestsQuery = `
      SELECT i.id, i.name FROM interests i
      JOIN user_interests ui ON i.id = ui.interest_id
      WHERE ui.user_id = ?
    `;

    db.query(interestsQuery, [userId], (err, interestsResult) => {
      if (err) {
        console.error('Error fetching user interests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.json({
        profile: userResult[0],
        interests: interestsResult
      });
    });
  });
});

// Update profile and selected interests
app.post('/users/update-profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { bio, age, gender, location, profile_picture, selectedInterests } = req.body;

  // Update user profile details including profile picture URL
  const updateUserQuery = `
    UPDATE users 
    SET bio = ?, age = ?, gender = ?, location = ?, profile_picture = ? 
    WHERE id = ?
  `;

  db.query(updateUserQuery, [bio, age, gender, location, profile_picture, userId], (err) => {
    if (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Update interests: remove old interests and insert new ones
    const deleteInterestsQuery = `DELETE FROM user_interests WHERE user_id = ?`;

    db.query(deleteInterestsQuery, [userId], (err) => {
      if (err) {
        console.error('Error clearing user interests:', err);
        return res.status(500).json({ message: 'Server error' });
      }

            // Insert new interests
            const insertInterestsQuery = `INSERT INTO user_interests (user_id, interest_id) VALUES ?`;
            const interestsData = selectedInterests.map(interestId => [userId, interestId]);
      
            db.query(insertInterestsQuery, [interestsData], (err) => {
              if (err) {
                console.error('Error updating interests:', err);
                return res.status(500).json({ message: 'Server error' });
              }
      
              res.json({ message: 'Profile updated successfully!' });
            });
          });
        });
      });
      


app.get('/users/profile/:id', (req, res) => {
    const userId = req.params.id;

    // Query to get user profile
    const userQuery = 'SELECT * FROM users WHERE id = ?';

    // Query to get user interests
    const interestsQuery = `
        SELECT i.id, i.name FROM interests i
        JOIN user_interests ui ON i.id = ui.interest_id
        WHERE ui.user_id = ?
    `;

    db.query(userQuery, [userId], (error, userResults) => {
        if (error) {
            return res.status(500).json({ error: 'Server error' });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userProfile = userResults[0];

        // Now fetch the interests of the user
        db.query(interestsQuery, [userId], (error, interestResults) => {
            if (error) {
                return res.status(500).json({ error: 'Server error' });
            }

            // Send back both the user profile and interests
            res.json({
                profile: userProfile,
                interests: interestResults
            });
        });
    });
});

// Like a user route
app.post('/users/like', authenticateToken, (req, res) => {
  const userId = req.user.id;  // Ensure the user ID is available from the request
  const { likedUserId } = req.body;  // ID of the user being liked

  if (!userId || !likedUserId) {
    return res.status(400).json({ message: 'Missing user data.' });
  }

  // First, check if the liked user has already liked the current user
  const checkQuery = `
      SELECT * FROM user_matches 
      WHERE user_id = ? AND matched_user_id = ? AND status = 'interested'
  `;

  db.query(checkQuery, [likedUserId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error when checking matches.' });

    if (results.length > 0) {
      // Mutual match found, update both entries to 'matched'
      const updateQuery = `
          UPDATE user_matches 
          SET status = 'matched' 
          WHERE (user_id = ? AND matched_user_id = ?) 
          OR (user_id = ? AND matched_user_id = ?)
      `;
      db.query(updateQuery, [userId, likedUserId, likedUserId, userId], (err) => {
        if (err) return res.status(500).json({ message: 'Error updating match status.' });
        return res.json({ message: "It's a match!" });
      });
    } else {
      // No mutual match, insert a new record of interest
      const insertQuery = `
          INSERT INTO user_matches (user_id, matched_user_id, status) 
          VALUES (?, ?, 'interested')
      `;
      db.query(insertQuery, [userId, likedUserId], (err) => {
        if (err) return res.status(500).json({ message: 'Error inserting like.' });
        return res.json({ message: 'User liked' });
      });
    }
  });
});

// Membership Tiers Routes
app.get('/membership-tiers', (req, res) => {
  const query = 'SELECT * FROM membership_tiers';
  
  db.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching membership tiers:', err);
          return res.status(500).json({ message: 'Server error fetching membership tiers' });
      }
      res.json(results);
  });
});

// Select membership route
app.post('/users/select-membership', authenticateToken, (req, res) => {
  const { membership_tier_id } = req.body;
  const userId = req.user.id;  // Assuming the token is decoded and req.user contains user data

  const query = 'UPDATE users SET membership_tier_id = ? WHERE id = ?';
  
  db.query(query, [membership_tier_id, userId], (err) => {
      if (err) {
          console.error('Error updating membership:', err);
          return res.status(500).json({ message: 'Server error updating membership' });
      }
      res.json({ message: 'Membership updated successfully!' });
  });
});
// Fetch the current user's membership tier
app.get('/users/membership-tier', authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  const query = `
    SELECT mt.name AS tier 
    FROM users u
    JOIN membership_tiers mt ON u.membership_tier_id = mt.id
    WHERE u.id = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching membership tier:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ message: 'Membership tier not found' });
    }

    res.json({ tier: result[0].tier });
  });
});

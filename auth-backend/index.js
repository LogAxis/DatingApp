const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
    db.query('INSERT INTO users (name, email, password, membership_tier_id) VALUES (?, ?, ?, 1)', [name, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error registering user' });

      const userId = results.insertId;

      // Query the user's membership tier (default tier on registration)
      db.query('SELECT membership_tier_id FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error fetching membership tier' });

        const membershipTierId = result[0].membership_tier_id;

        // Generate JWT token with user ID and membership tier ID
        const token = jwt.sign(
          { id: userId, membership_tier_id: membershipTierId },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        // Return the userId and token to the frontend
        res.status(201).json({ userId, token });
      });
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

    // Generate JWT token with user ID and membership tier ID
    const token = jwt.sign(
      { id: user.id, membership_tier_id: user.membership_tier_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ userId: user.id, token });
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
// Secure dashboard route
app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({
    message: "Welcome to the dashboard!",
    userId: req.user.id,
    membershipTierId: req.user.membership_tier_id
  });
});

// POST route to add interests to user's profile
app.post('/users/interests', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const selectedInterests = req.body.interests;

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
  const userId = req.user.id;
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

app.get('/users/matches', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Fetch the logged-in user's gender and location
  const getUserDetailsQuery = `SELECT gender, location FROM users WHERE id = ?`;

  db.query(getUserDetailsQuery, [userId], (err, userResult) => {
    if (err || userResult.length === 0) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    const { gender: userGender, location: userLocation } = userResult[0];
    let oppositeGender;

    // Determine the gender to fetch based on the logged-in user's gender
    if (userGender === 'male') {
      oppositeGender = 'female';
    } else if (userGender === 'female') {
      oppositeGender = 'male';
    } else {
      oppositeGender = 'other'; // Match 'other' with other users who also selected 'other'
    }

    // Fetch matches with similar interests, opposite gender, sorted by location and timestamp
    const query = `
      SELECT u.id, u.name, u.bio, u.created_at, u.profile_picture, u.location,
        CASE WHEN u.location = ? THEN 1 ELSE 0 END AS location_priority
      FROM users u
      JOIN user_interests ui1 ON u.id = ui1.user_id
      JOIN user_interests ui2 ON ui1.interest_id = ui2.interest_id
      WHERE ui2.user_id = ? 
        AND u.id != ?  -- Exclude the logged-in user
        AND u.gender = ?  -- Match with opposite or same gender
      GROUP BY u.id
      ORDER BY location_priority DESC, u.created_at DESC;`;

    db.query(query, [userLocation, userId, userId, oppositeGender], (err, results) => {
      if (err) {
        console.error('Error fetching matches:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.json(results);
    });
  });
});



// Fetch the current user's profile and their selected interests
app.get('/users/profile', authenticateToken, (req, res) => {
  const userId = req.user.id;

  // Fetch user's profile information
  const userQuery = `
    SELECT id, name, email, bio, age, gender, location, profile_picture FROM users WHERE id = ?`;

  db.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    // Fetch user's selected interests
    const interestsQuery = `
      SELECT i.id, i.name FROM interests i
      JOIN user_interests ui ON i.id = ui.interest_id
      WHERE ui.user_id = ?`;

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

// POST route to like a user
app.post('/users/like', authenticateToken, (req, res) => {
  const userId = req.user.id;  // This assumes the authenticated user's ID is attached via the token
  const { likedUserId } = req.body;

  if (!likedUserId) {
      return res.status(400).json({ message: 'likedUserId is required.' });
  }

  const checkLikeQuery = `
      INSERT INTO user_likes (user_id, liked_user_id, status)
      VALUES (?, ?, 'liked')
      ON DUPLICATE KEY UPDATE status = 'liked'`;

  db.query(checkLikeQuery, [userId, likedUserId], (err, results) => {
      if (err) {
          console.error('Error inserting like into user_likes table:', err);
          return res.status(500).json({ message: 'Server error.' });
      }
      res.json({ message: 'User liked successfully' });
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
  const userId = req.user.id;

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
    WHERE u.id = ?`;

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

// Update profile and selected interests
app.post('/users/update-profile', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { bio, age, gender, location, profile_picture, selectedInterests } = req.body;

  // Update user profile details including profile picture URL
  const updateUserQuery = `
    UPDATE users 
    SET bio = ?, age = ?, gender = ?, location = ?, profile_picture = ? 
    WHERE id = ?`;

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

          // Send back both the user xaprofile and interests
          res.json({
              profile: userProfile,
              interests: interestResults
          });
      });
  });
});
// Route to fetch user details (id and name) from the database
app.get('/user-details', authenticateToken, (req, res) => {
  const userId = req.user.id;  // Extract userId from JWT token (set in authenticateToken middleware)

  // Query to get user info from the database
  const query = 'SELECT id, name FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching user details from the database:', err);
          return res.status(500).json({ message: 'Server error fetching user details' });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Respond with user details
      const user = results[0];  // Assuming results[0] contains the user info
      res.json({
          userId: user.id,
          userName: user.name,
      });
  });
});
// Route to fetch user ID and name
app.get('/users', (req, res) => {
  const query = 'SELECT id, name FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});

// Get matched users
app.get('/users/matched', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = `
      SELECT u.id, u.name, u.bio, u.profile_picture
      FROM users u
      JOIN user_matches m ON (u.id = m.matched_user_id AND m.user_id = ?)
      WHERE m.status = 'matched'`;

  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Error fetching matches:', err);
          return res.status(500).json({ message: 'Server error' });
      }

      // Return an empty array if no matches are found
      res.json(results.length > 0 ? results : []);
  });
});


// Function to check for mutual likes and move them to matches
const checkForMutualLikes = () => {
  db.beginTransaction((err) => {
      if (err) throw err;

      // Step 1: Find mutual likes
      const mutualLikesQuery = `
          SELECT ul1.user_id AS user1, ul1.liked_user_id AS user2
          FROM user_likes ul1
          JOIN user_likes ul2 ON ul1.user_id = ul2.liked_user_id AND ul1.liked_user_id = ul2.user_id
          WHERE ul1.user_id < ul1.liked_user_id`;

      db.query(mutualLikesQuery, (err, results) => {
          if (err) {
              return db.rollback(() => {
                  throw err;
              });
          }

          if (results.length === 0) {
              console.log("No mutual likes found.");
              return db.commit(); // No mutual likes to process
          }

          // Step 2: Insert mutual likes into `user_matches`, avoiding duplicates
          const insertMatchesQuery = `
              INSERT INTO user_matches (user_id, matched_user_id, status)
              VALUES ?
              ON DUPLICATE KEY UPDATE status = 'matched'`;

          const matchesData = results.map((row) => [row.user1, row.user2, 'matched']);
          
          db.query(insertMatchesQuery, [matchesData], (err) => {
              if (err) {
                  return db.rollback(() => {
                      throw err;
                  });
              }

              // Step 3: Remove entries from `user_likes` table
              const deleteLikesQuery = `
                  DELETE FROM user_likes 
                  WHERE (user_id, liked_user_id) IN (?) OR (user_id, liked_user_id) IN (?)`;
              
              const likesPairs = results.map(row => [row.user1, row.user2]);
              const reverseLikesPairs = results.map(row => [row.user2, row.user1]);

              db.query(deleteLikesQuery, [likesPairs, reverseLikesPairs], (err) => {
                  if (err) {
                      return db.rollback(() => {
                          throw err;
                      });
                  }

                  // Commit transaction if all queries succeed
                  db.commit((err) => {
                      if (err) {
                          return db.rollback(() => {
                              throw err;
                          });
                      }
                      console.log("Mutual likes processed and moved to matches.");
                  });
              });
          });
      });
  });
};


// Add an endpoint to trigger the checkForMutualLikes function manually if needed
app.post('/check-mutual-likes', (req, res) => {
  try {
      checkForMutualLikes();
      res.json({ message: 'Mutual likes check initiated.' });
  } catch (error) {
      console.error('Error processing mutual likes:', error);
      res.status(500).json({ message: 'Error processing mutual likes.' });
  }
});


// Email configuration
const transporter = nodemailer.createTransport({
  service: 'Gmail',  // or any email service you use
  auth: {
      user: process.env.EMAIL_USER||'logaxisp@gmail.com',
      pass: process.env.EMAIL_PASSWORD||'0720436856',
  },
});

// Request password reset
app.post('/request-password-reset', (req, res) => {
  const { email } = req.body;

  // Check if user exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err || results.length === 0) {
          return res.status(400).json({ message: 'User not found' });
      }

      const user = results[0];
      
      // Generate a token valid for 1 hour
      const resetToken = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      // Generate reset link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Send email with reset link
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset',
          text: `Click on the link to reset your password: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
              console.error('Error sending email:', err);
              return res.status(500).json({ message: 'Error sending email' });
          }
          res.json({ message: 'Password reset email sent successfully' });
      });
  });
});

// Reset password
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(400).json({ message: 'Invalid or expired token' });

      const userId = decoded.id;

      // Hash the new password
      const hashedPassword = bcrypt.hashSync(newPassword, 8);

      // Update user's password in the database
      db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], (err) => {
          if (err) {
              console.error('Error updating password:', err);
              return res.status(500).json({ message: 'Server error' });
          }
          res.json({ message: 'Password reset successfully' });
      });
  });
});
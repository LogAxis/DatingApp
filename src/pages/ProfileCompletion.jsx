import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderThree from '../Components/layout/headerthree';

const ProfileCompletion = () => {
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);  // Store selected image file
  const [profilePictureUrl, setProfilePictureUrl] = useState('');  // Store the image URL from imgbb
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');  // Redirect to login if token is missing
    }

    // Fetch the list of interests from the backend
    axios.get('http://localhost:5000/interests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setAllInterests(response.data))
      .catch(error => console.error('Error fetching interests:', error));
  }, [navigate]);

  const handleInterestChange = (interestId) => {
    setSelectedInterests((prevSelectedInterests) => {
      if (prevSelectedInterests.includes(interestId)) {
        return prevSelectedInterests.filter(id => id !== interestId);
      } else {
        return [...prevSelectedInterests, interestId];
      }
    });
  };

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      let imageUrl = profilePictureUrl;

      // If a new profile picture is uploaded, upload it to imgbb
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('image', profilePictureFile);
        const imgbbApiKey = '02b59bfd9db219558faf0048e92fc1fa';  // Replace with your real imgbb API key

        try {
          const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
          imageUrl = imgbbResponse.data.data.url;  // Get the uploaded image URL
          setProfilePictureUrl(imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
          setError('Failed to upload profile picture.');
          setLoading(false);
          return;
        }
      }

      // Send the profile data along with the token in the headers
      await axios.post('http://localhost:5000/users/profile-completion', {
        bio,
        age,
        gender,
        location,
        profile_picture: imageUrl,
        interests: selectedInterests,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);  // Stop loading after completion
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Fragment>
      <HeaderThree/>
    <div className="container mt-5">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="form-group">
          <label>Profile Picture:</label>
          {profilePictureUrl && (
            <div>
              <img
                src={profilePictureUrl}
                alt="Profile"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
          )}
          <input
            type="file"
            className="form-control mt-2"
            onChange={handleProfilePictureChange}
          />
        </div>

        {/* Bio */}
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            className="form-control"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </div>

        {/* Gender */}
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            className="form-control"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
          />
        </div>

        {/* Interests */}
        <div className="form-group">
          <label>Select your interests:</label>
          <div className="interest-list">
            {allInterests.map(interest => (
              <div key={interest.id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`interest-${interest.id}`}
                  value={interest.id}
                  onChange={() => handleInterestChange(interest.id)}
                />
                <label className="form-check-label" htmlFor={`interest-${interest.id}`}>
                  {interest.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          Save Profile
        </button>
      </form>
    </div>
    </Fragment>
  );
};

export default ProfileCompletion;

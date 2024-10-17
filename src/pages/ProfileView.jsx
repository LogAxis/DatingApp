import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderThree from '../Components/layout/headerthree';

const ProfileView = () => {
  const [profile, setProfile] = useState({
    bio: '',
    age: '',
    gender: '',
    location: '',
    profile_picture: '',  // This will store the image URL
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);  // To store the selected image file
  const [interests, setInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch profile and interests data from the backend
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { profile, interests } = response.data;
        setProfile(profile);
        setSelectedInterests(interests.map(i => i.id));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile.');
        setLoading(false);
      }
    };

    // Fetch all available interests
    const fetchInterests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllInterests(response.data);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchProfile();
    fetchInterests();
  }, [navigate]);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let imageUrl = profile.profile_picture;  // Default to the existing profile picture

      // If a new profile picture is uploaded, upload it to imgbb
      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('image', profilePictureFile);
        const imgbbApiKey = '02b59bfd9db219558faf0048e92fc1fa';  // Replace with your actual imgbb API key

        const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
        imageUrl = imgbbResponse.data.data.url;  // Get the uploaded image URL
      }

      // Update profile with the image URL
      await axios.post('http://localhost:5000/users/update-profile', {
        ...profile,
        selectedInterests,
        profile_picture: imageUrl,  // Set the image URL to the profile picture field
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
    }
  };

  const handleInterestChange = (interestId) => {
    setSelectedInterests((prevSelectedInterests) => {
      if (prevSelectedInterests.includes(interestId)) {
        return prevSelectedInterests.filter(id => id !== interestId);
      } else {
        return [...prevSelectedInterests, interestId];
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <Fragment>
      <HeaderThree/>
      <div className="container mt-5">
        <h2 className="text-center">Your Profile</h2>
        <div className="card shadow p-4">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="form-group text-center">
              {profile.profile_picture ? (
                <img
                
                  src={profile.profile_picture}  // Use the image URL for rendering
                  alt="Profile"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                <div
                  style={{
                    width: '150px',
                    height: '150px',
                    backgroundColor: '#ddd',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#666',
                  }}
                >
                  No Image
                </div>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleProfilePictureChange}
              />
            </div>

            {/* Bio */}
            <div className="form-group mt-3">
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                value={profile.bio || ''}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            {/* Age */}
            <div className="form-group mt-3">
              <label htmlFor="age">Age:</label>
              <input
                type="number"
                id="age"
                name="age"
                className="form-control"
                value={profile.age}
                onChange={handleInputChange}
              />
            </div>

            {/* Gender */}
            <div className="form-group mt-3">
              <label htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"
                className="form-control"
                value={profile.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Location */}
            <div className="form-group mt-3">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={profile.location}
                onChange={handleInputChange}
              />
            </div>

            {/* Interests */}
            <div className="form-group mt-3">
              <label>Your Interests:</label>
              <div className="interest-list d-flex flex-wrap">
                {allInterests.map(interest => (
                  <div key={interest.id} className="form-check me-3 mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedInterests.includes(interest.id)}
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

            <button type="submit" className="btn btn-primary mt-4 w-100">Save Changes</button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileView;

import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderThree from '../Components/layout/headerthree';
import style from '../styleProfle.css';

const townsInSouthAfrica = [
  "Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth",
  "Bloemfontein", "Nelspruit", "Kimberley", "Pietermaritzburg", "East London",
  "Polokwane", "Rustenburg", "George", "Welkom", "Newcastle",
  "Vereeniging", "Soweto", "Benoni", "Tembisa", "Kempton Park",
  "Midrand", "Randburg", "Roodepoort", "Brakpan", "Germiston",
  "Boksburg", "Springs", "Centurion", "Klerksdorp", "Emalahleni (Witbank)",
  "Secunda", "Bethal", "Standerton", "Vanderbijlpark", "Carletonville",
  "Mokopane", "Mahikeng", "Giyani", "Thohoyandou", "Tzaneen",
  "Mthatha", "Queenstown", "Butterworth", "Uitenhage", "Graaff-Reinet",
  "Stellenbosch", "Paarl", "Franschhoek", "Hermanus", "Knysna",
  "Mossel Bay", "Beaufort West", "Ladysmith", "Margate", "Pinetown",
  "Umlazi", "Chatsworth", "Sasolburg", "Louis Trichardt", "Phalaborwa",
  "Upington", "Springbok", "Lichtenburg", "Swellendam", "Malmesbury",
  "Worcester", "Khayelitsha", "Mitchells Plain", "Potchefstroom",
  "Carletonville", "Delmas", "Bela-Bela", "Modimolle", "Lephalale",
  "Middelburg", "Hartbeespoort", "Vryheid", "Mount Fletcher", "Jozini",
  "Gansbaai", "Colesberg", "Aliwal North", "Kokstad",
  "Dundee", "Hluhluwe", "Sabie", "Graskop", "St Lucia",
  "Komatipoort", "Groblersdal", "Middelburg", "Ceres", "Vredenburg"
];
const ProfileView = () => {
  const [profile, setProfile] = useState({
    bio: '',
    age: '',
    gender: '',
    location: '',
    profile_picture: '',
    id: '',
  });
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [interests, setInterests] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [filteredTowns, setFilteredTowns] = useState(townsInSouthAfrica);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interestPage, setInterestPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { profile, interests } = response.data;
        setProfile(profile);
        setSelectedInterests(interests?.map(i => i.id) || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile.');
        setLoading(false);
      }
    };

    const fetchInterests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/interests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllInterests(response.data || []);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
    };

    fetchProfile();
    fetchInterests();
  }, [navigate]);

  const handleProfilePictureChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      let imageUrl = profile?.profile_picture;

      if (profilePictureFile) {
        const formData = new FormData();
        formData.append('image', profilePictureFile);
        const imgbbApiKey = '02b59bfd9db219558faf0048e92fc1fa';

        const imgbbResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, formData);
        imageUrl = imgbbResponse.data?.data?.url;
      }

      await axios.post('http://localhost:5000/users/update-profile', {
        ...profile,
        selectedInterests,
        profile_picture: imageUrl,
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

  const handleTownSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilteredTowns(
      townsInSouthAfrica.filter(town => town.toLowerCase().includes(searchTerm))
    );
  };

  const loadMoreInterests = () => {
    setInterestPage(prevPage => prevPage + 1);
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const displayedInterests = allInterests.slice(0, interestPage * 10);

  return (
    <Fragment>
      <HeaderThree/>
      <div className="container mt-5">
        <h2 className="text-center">Edit Your Profile</h2>
        <div className="card shadow-lg p-4" style={{
          borderRadius: '20px',
          overflow: 'hidden',
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          backgroundColor: '#f9f9f9'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group text-center mb-4">
              {profile?.profile_picture ? (
                <img
                  src={profile.profile_picture}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '300px',
                    backgroundColor: '#ddd',
                    borderRadius: '15px',
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
              <label htmlFor="profilePicture" className="btn btn-secondary mt-2" style={{
                cursor: 'pointer',
                padding: '10px 20px',
                fontSize: '1rem',
                borderRadius: '20px'
              }}>
                Choose File
              </label>
              <input
                type="file"
                id="profilePicture"
                style={{ display: 'none' }}
                onChange={handleProfilePictureChange}
              />
            </div>

            {/* Flex Container for Bio, Age, Gender */}
            <div className="d-flex justify-content-between">
              <div className="form-group w-50 me-3">
                <label htmlFor="bio">Bio:</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-control"
                  value={profile?.bio || ''}
                  onChange={handleInputChange}
                  rows="5"
                  style={{ borderRadius: '10px', padding: '10px' }}
                />
              </div>

              <div className="w-50">
                <div className="form-group mt-1">
                  <label htmlFor="age">Age:</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    className="form-control"
                    value={profile?.age || ''}
                    onChange={handleInputChange}
                    style={{ borderRadius: '10px', padding: '5px', width: '70%' }}
                  />
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="gender">Gender:</label>
                  <select
                    id="gender"
                    name="gender"
                    className="form-control"
                    value={profile?.gender || ''}
                    onChange={handleInputChange}
                    style={{ borderRadius: '10px', padding: '5px', width: '70%' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group mt-3">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Search for a town..."
                onChange={handleTownSearch}
                style={{ borderRadius: '10px', padding: '5px' }}
              />
              <select
                id="location"
                name="location"
                className="form-control"
                value={profile?.location || ''}
                onChange={handleInputChange}
                style={{ borderRadius: '10px', padding: '5px' }}
              >
                <option value="">Select Town</option>
                {filteredTowns.map((town, index) => (
                  <option key={index} value={town}>
                    {town}
                  </option>
                ))}
              </select>
            </div>

            {/* Interests */}
            <div className="form-group mt-3">
              <label>Your Interests:</label>
              <div className={style.interestListGrid}>
                {displayedInterests.map(interest => (
                  <div
                    key={interest.id}
                    onClick={() => handleInterestChange(interest.id)}
                    className="badge m-1 p-2"
                    style={{
                      display: 'inline-block',
                      padding: '10px 15px',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: selectedInterests.includes(interest.id) ? '#fff' : '#333',
                      backgroundColor: selectedInterests.includes(interest.id) ? '#ff6b6b' : '#e0e0e0',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                  >
                    {interest.name}
                  </div>
                ))}
              </div>
              {displayedInterests.length < allInterests.length && (
                <button
                  type="button"
                  onClick={loadMoreInterests}
                  className="btn btn-link mt-2"
                  style={{ textDecoration: 'none', color: '#ff6b6b' }}
                >
                  Load More
                </button>
              )}
            </div>

            <button type="submit" className="btn w-100 mt-4" style={{
              backgroundColor: '#ff6b6b',
              color: 'white',
              padding: '12px 0',
              fontSize: '1.2rem',
              borderRadius: '30px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              transition: 'background-color 0.3s',
              cursor: 'pointer'
            }}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileView;

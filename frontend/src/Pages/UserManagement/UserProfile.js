import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserEdit, FaTrashAlt, FaSignOutAlt, FaUser, FaEnvelope, FaPhone, FaInfoCircle } from 'react-icons/fa';
import NavBar from '../../Components/NavBar/NavBar';
import { useNavigate } from 'react-router-dom';
import { FaNewspaper, FaChartLine } from 'react-icons/fa';
function UserProfile() {
    const [userData, setUserData] = useState(null);
    const userId = localStorage.getItem('userID');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('userID');
        localStorage.removeItem('userType');
        window.location.href = '/';
    };
    const cards = [
        {
            title: "My Posts",
            icon: <FaNewspaper size={24} />,
            description: "View and manage your content",
            path: "/my-posts",
            color: "#071248"
        },
        {
            title: "My Progress",
            icon: <FaChartLine size={24} />,
            description: "Track your activity and growth",
            path: "/myProgress",
            color: "#0a1a6b"
        }
    ];
    return (
        <div>
            <NavBar />
            <br /><br /><br />
            <div className='flx_set'>
                <div className="profile-container">
                    {userData && (
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar">
                                    <FaUser size={50} />
                                </div>
                                <h2>{userData.fullname}</h2>
                            </div>

                            <div className="profile-details">
                                <div className="detail-item">
                                    <FaEnvelope className="detail-icon" />
                                    <span><strong>Email:</strong> {userData.email}</span>
                                </div>
                                {localStorage.getItem('userType') !== 'google' && (
                                    <>
                                        <div className="detail-item">
                                            <FaPhone className="detail-icon" />
                                            <span><strong>Phone:</strong> {userData.phone}</span>
                                        </div>
                                        <div className="detail-item">
                                            <FaInfoCircle className="detail-icon" />
                                            <span><strong>Bio:</strong> {userData.bio || 'Not specified'}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="profile-actions">
                                {localStorage.getItem('userType') !== 'google' && (
                                    <>
                                        <button
                                            className="btn-update"
                                            onClick={() => (window.location.href = `/updateUserProfile/${userId}`)}
                                        >
                                            <FaUserEdit /> Update
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete your profile?')) {
                                                    axios.delete(`http://localhost:8080/user/${userId}`)
                                                        .then(() => {
                                                            alert('Profile deleted successfully!');
                                                            localStorage.removeItem('userID');
                                                            window.location.href = '/';
                                                        })
                                                        .catch(error => console.error('Error deleting profile:', error));
                                                }
                                            }}
                                        >
                                            <FaTrashAlt /> Delete
                                        </button>
                                    </>
                                )}
                                <button
                                    className="btn-logout"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div className="cards-container">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className="nav-card"
                            onClick={() => navigate(card.path)}
                            style={{ '--card-color': card.color }}
                        >
                            <div className="card-icon">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                            <div className="card-hover-indicator">→</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
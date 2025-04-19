import React, { useEffect, useState } from 'react';
import { FaUserCircle } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import axios from 'axios';
import './NavBar.css';

function NavBar() {
    const [allRead, setAllRead] = useState(true);
    const userId = localStorage.getItem('userID');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
                const unreadNotifications = response.data.some(notification => !notification.read);
                setAllRead(!unreadNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const currentPath = window.location.pathname;

    return (
        <div className="navbar">
            <div className='nav_con'>
                <div className='nav_item_set'>
                    <div className='side_logoo'></div>
                    <div className='nav_bar_item'>
                        <p className={`nav_item ${currentPath === '/allPost' ? 'nav_item_active' : ''}`} onClick={() => (window.location.href = '/allPost')}>Post</p>
                        <p className={`nav_item ${currentPath === '/learningProgress' ? 'nav_item_active' : ''}`} onClick={() => (window.location.href = '/learningProgress')}>Learning Progress</p>
                        {allRead ? (
                            <MdNotifications
                                className={`nav_item_icon ${currentPath === '/notifications' ? 'nav_item_icon_noty' : ''}`}
                                onClick={() => (window.location.href = '/notifications')} />
                        ) : (
                            <MdNotificationsActive className='nav_item_icon_noty' onClick={() => (window.location.href = '/notifications')} />
                        )}
                       
                        <FaUserCircle
                            className={`nav_item_icon ${currentPath === '/userProfile' ? 'nav_item_icon_noty' : ''}`}
                            onClick={() => (window.location.href = "/userProfile")}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default NavBar;

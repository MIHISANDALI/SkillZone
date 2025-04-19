import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../Components/NavBar/NavBar';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdNotificationsOff } from "react-icons/io";
import { MdMarkEmailRead } from "react-icons/md";
import './notification.css';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notification-page">
      <SideBar />
      <div className='continer'>
        <div className='continSection'>
          <h2 className="notifications-title">Notifications</h2>
          {notifications.length === 0 ? (
            <div className='not_found_box'>
              <IoMdNotificationsOff className='not_found_img_nn' size={48} />
              <p className='not_found_msg'>No notifications found.</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <p className="notification-time">{new Date(notification.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="mark-read-btn"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <MdMarkEmailRead /> Mark as Read
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <RiDeleteBin6Fill /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;
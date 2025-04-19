import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import SideBar from '../../Components/NavBar/NavBar';
import { FaUserCircle } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import { MdCreate } from "react-icons/md";
import './Learning.css'
function MyLearningProgress() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/learningProgress')
      .then((response) => response.json())
      .then((data) => {
        const filtered = data.filter((progress) => progress.postOwnerID === userId);
        setProgressData(filtered);
        setFilteredData(filtered); // Show only matching data
      })
      .catch((error) => console.error('Error fetching learning progress data:', error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning progress?')) {
      try {
        const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Learning Progress deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Learning Progress.');
        }
      } catch (error) {
        console.error('Error deleting learning progress:', error);
      }
    }
  };


  return (
    <div>
      <SideBar />
      <br /> <br /> <br /> <br />
      <div className='continer'>
        <div>
          <div className='create_btn' onClick={() => (window.location.href = '/addLearningProgress')}>
            <MdCreate />
          </div>
          <div className="learning-progress-page">
            <div className="progress-container">
              <div className="progress-content">
                {filteredData.length === 0 ? (
                  <div className='not_found_box'>
                    <div className='not_found_img'></div>
                    <p className='not_found_msg'>No posts found. Please create a new post.</p>
                    <button
                      className='not_found_btn'
                      onClick={() => (window.location.href = '/addLearningProgress')}
                    >
                      Create New Post
                    </button>
                  </div>
                ) : (
                  <div className="progress-cards">
                    {filteredData.map((progress) => (
                      <div key={progress.id} className="progress-card">
                        <div className="card-header">
                          <div className="user-info">
                            <FaUserCircle className="user-icon" />
                            <span>{progress.postOwnerName}</span>
                          </div>
                          {progress.postOwnerID === userId && (
                            <div className="card-actions">
                              <FaEdit
                                className="edit-icon"
                                onClick={() => (window.location.href = `/updateLearningProgress/${progress.id}`)}
                              />
                              <RiDeleteBin6Fill
                                className="delete-icon"
                                onClick={() => handleDelete(progress.id)}
                              />
                            </div>
                          )}
                        </div>

                        <div className="progress-title">
                          <h3>{progress.skillTitle}</h3>
                          <div className="progress-image">
                            {progress.imagePath && (
                              <img
                                src={`http://localhost:8080/learningProgress/image/${progress.imagePath}`}
                                alt="Progress"
                                className="progress-img"
                              />
                            )}
                          </div>
                          {progress.pdfPath && (
                            <div className="progress-pdf">
                              <a
                                href={`http://localhost:8080/learningProgress/pdf/${progress.pdfPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-pdf-link"
                              >
                                View PDF
                              </a>
                            </div>
                          )}
                          <div className="progress-meta">
                            <span className="field-badge">{progress.field}</span>
                          </div>
                        </div>

                        <div className="progress-dates">
                          <HiCalendarDateRange className="calendar-icon" />
                          <span>{progress.startDate} to {progress.endDate}</span>
                        </div>
                        <div className="progress-description">
                          <h4>Description</h4>
                          <p>{progress.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLearningProgress;

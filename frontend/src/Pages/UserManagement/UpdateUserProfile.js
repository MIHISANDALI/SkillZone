import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../Components/NavBar/NavBar';
function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phone: '',
    bio: '', // Added bio field
  });
 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        return response.json();
      })
      .then((data) => setFormData({ ...data, bio: data.bio || '' })) // Ensure bio is set
      .catch((error) => console.error('Error:', error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Profile updated successfully!');
        window.location.reload();
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
              <div><SideBar /></div>
      <div className='continer'>

        <div className='continSection'>
          <div className="from_continer">
            <p className="Auth_heading">Update User Profile</p>
            <form onSubmit={handleSubmit} className="Auth_form">
              <div className="Auth_formGroup">
                <label className="Auth_label">Full Name</label>
                <input
                  className="Auth_input"
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Email Address</label>
                <input
                  className="Auth_input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Password</label>
                <input
                  className="Auth_input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Phone</label>
                <input
                  className="Auth_input"
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits."
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Bio</label>
                <textarea
                  className="Auth_input"
                  name="bio"
                  placeholder="Write something about yourself"
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="Auth_button">Update</button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;

import React, { useState } from 'react';
import axios from 'axios';
import SideBar from '../../Components/NavBar/NavBar';
function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]); // For storing media preview objects
  const userID = localStorage.getItem('userID');

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB


    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        window.location.reload();
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        // Validate video duration
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            window.location.reload();
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        window.location.reload();
      }

      // Add file preview object with type and URL
      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      window.location.reload();
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      window.location.reload();
    }

    setMedia(files);
        setMediaPreviews(previews); // Set preview objects
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    media.forEach((file, index) => formData.append(`mediaFiles`, file));

    try {
      const response = await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      window.location.href='/allPost';
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
      window.location.reload();
    }
  };

  return (
    <div>
      <SideBar />
      <div className='continer'>
        <div className='continSection'>
          <div className="from_continer">
            <p className="Auth_heading">Create New Post</p>
            <div className='flx_con'>
              <form onSubmit={handleSubmit} className='from_data flx_con_section'>
                <div className="Auth_formGroup">
                  <label className="Auth_label">Title</label>
                  <input
                    className="Auth_input"
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="Auth_formGroup">
                  <label className="Auth_label">Description</label>
                  <textarea
                    className="Auth_input"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                  />
                </div>
                <div className="Auth_formGroup">
                  <label className="Auth_label">Media</label>

                  <input
                    className="Auth_input"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,video/mp4"
                    multiple
                    onChange={handleMediaChange}
                  />
                </div>
                <button type="submit" className="Auth_button">Submit</button>
              </form>
              <div className='seket_media flx_con_section'>
                {mediaPreviews.map((preview, index) => (
                  <div key={index}>
                    {preview.type.startsWith('video/') ? (
                      <video controls className='media_file_se'>
                        <source src={preview.url} type={preview.type} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img className='media_file_se' src={preview.url} alt={`Media Preview ${index}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;

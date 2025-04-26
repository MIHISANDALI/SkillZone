import React, { useState, useEffect } from "react";
import SideBar from "../../Components/NavBar/NavBar";

function AddLearningProgress() {
  const [formData, setFormData] = useState({
    skillTitle: "",
    description: "",
    field: "",
    startDate: "",
    endDate: "",
    postOwnerID: "",
    postOwnerName: "",
  });
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({
              ...prevData,
              postOwnerName: data.fullname,
            }));
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await fetch(
        "http://localhost:8080/learningProgress/uploadImage",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        return await response.text();
      } else {
        alert("Failed to upload image.");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handlePDFUpload = async () => {
    if (!pdf) return null;
    const formData = new FormData();
    formData.append("pdf", pdf);
    try {
      const response = await fetch(
        "http://localhost:8080/learningProgress/uploadPDF",
        {
          method: "POST",
          body: formData,
        }
      );
      if (response.ok) {
        return await response.text();
      } else {
        alert("Failed to upload PDF.");
        return null;
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagePath = await handleImageUpload();
    const pdfPath = await handlePDFUpload();
    if (imagePath || pdfPath) {
      try {
        const response = await fetch("http://localhost:8080/learningProgress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, imagePath, pdfPath }),
        });
        if (response.ok) {
          alert("Learning Progress added successfully!");
          window.location.href = "/myProgress";
        } else {
          alert("Failed to add Learning Progress.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <div>
        {" "}
        <SideBar />
      </div>
      <div className="continer">
        <div className="continSection">
          <div className="from_continer">
            <p className="Auth_heading">Add Learning Progress</p>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setFormData({
                  skillTitle: "",
                  description: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  level: "",
                  postOwnerID: formData.postOwnerID,
                  postOwnerName: formData.postOwnerName,
                });
              }}
              className="from_data"
            >
              <div className="two_fels_row">
                <div className="Auth_formGroup">
                  <label className="Auth_label">Title</label>
                  <input
                    className="Auth_input"
                    name="skillTitle"
                    placeholder="Skill Title"
                    value={formData.skillTitle}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="Auth_formGroup">
                  <label className="Auth_label">Field</label>
                  <select
                    className="Auth_input"
                    name="field"
                    value={formData.field}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select Field
                    </option>
                    <option value="Frontend Development">
                      Frontend Development
                    </option>
                    <option value="Programming Language">
                      Programming Language
                    </option>
                    <option value="Backend Development">
                      Backend Development
                    </option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                  </select>
                </div>
              </div>
              <div className="two_fels_row">
                <div className="Auth_formGroup">
                  <label className="Auth_label">Start Date</label>
                  <input
                    className="Auth_input"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="Auth_formGroup">
                  <label className="Auth_label">End Date</label>
                  <input
                    className="Auth_input"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      if (new Date(value) < new Date(formData.startDate)) {
                        alert("End date cannot be earlier than start date.");
                        return;
                      }
                      handleChange(e);
                    }}
                    required
                  />
                </div>
              </div>
              <div className="two_fels_row">
                <div className="Auth_formGroup">
                  <label className="Auth_label">Upload Image</label>
                  <input
                    className="Auth_input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
                <div className="Auth_formGroup">
                  <label className="Auth_label">Upload PDF</label>
                  <input
                    className="Auth_input"
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdf(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Description</label>
                <textarea
                  className="Auth_input"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <button type="submit" className="Auth_button">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearningProgress;

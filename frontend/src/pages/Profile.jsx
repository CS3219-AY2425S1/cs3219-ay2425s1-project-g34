import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import GeneralNavbar from "../components/navbar/GeneralNavbar";
import "../styles/Profile.css";
import { validateEmail, validateUsername } from "../services/user-service";
import DefaultImage from '../assets/Default.jpg';
import EditImage from '../assets/Edit.png';
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { userId, cookies } = useAuth();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
  });
  const [profilePic, setProfilePic] = useState(DefaultImage);
  const [isEditing, setIsEditing] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch user data when userId is available
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        });
        setUserData({
          username: data.data.username,
          email: data.data.email,
        });
        setProfilePic(data.data.profileImage || DefaultImage);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load profile");
      }
    };
    if (userId) {
      fetchUserProfile();
    }
  }, [userId, cookies]);

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    // Validation
    const res = validateUsername(userData.username) || validateEmail(userData.email);
    if (res) {
      toast.error(res);
      return;
    }

    try {
      // Extract username and email from the userData state
      const updatedData = {
        username: userData.username,
        email: userData.email,
      };
  
      // Send PATCH request to the backend
      const response = await axios.patch(
        `http://localhost:3001/users/${userId}`,
        updatedData, // Only include username and email
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`, // Use the token for authorization
          },
          withCredentials: true,
        }
      );
  
      // If successful, update the UI and show success message
      if (response.status === 200) {
        toast.success("Changes saved successfully!");
      } else {
        toast.error("Failed to save changes.");
      }
  
      // Disable editing after saving
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save changes: " + 
        (error.response && error.response.data && error.response.data.message) + '.'
      );
    }
  };

  // Handle file change
  const handleFileChange = async (e) => {
    console.log(e.target.files);
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      try {
        const response = await axios.patch(
          `http://localhost:3001/users/${userId}/profileImage`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${cookies.token}`,
            },
            withCredentials: true,
          }
        );
        
        if (response.status === 200) {
          toast.success("Profile picture uploaded successfully!");
          setProfilePic(URL.createObjectURL(file)); // Update the profile pic preview
          setShowBubble(false);
        } else {
          toast.error("Failed to upload profile picture.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload profile picture.");
      } finally {
        // Reset file input after handling file change
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Handle "Upload a photo" click
  const handleUploadPhotoClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  // Handle removing the profile picture
  const handleRemovePhoto = async () => {
    try {
      const updatedData = {
        toDefault: true,
      };
      const response = await axios.patch(
        `http://localhost:3001/users/${userId}/profileImage`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
          withCredentials: true,
        }
      );
  
      // If successful, reset to default image and update the UI
      if (response.status === 200) {
        toast.success("Profile picture removed successfully!");
        setProfilePic(DefaultImage); // Reset the profile picture to the default image
        setShowBubble(false); // Hide the options bubble after removing the photo
      } else {
        toast.error("Failed to remove profile picture.");
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture.");
    } finally {
      // Reset file input after handling file change
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <GeneralNavbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">User Profile</h1>
          <p className="profile-subtitle">Manage your profile.</p>
        </div>

        <div className="profile-content">
          {/* Profile Picture Section */}
          <div className="profile-pic-section" onClick={() => setShowBubble((prev) => !prev)}>
            <img
              src={profilePic || DefaultImage}
              alt="Profile"
              className="profile-pic"
            />

            <div className="edit-overlay">
              <img src={EditImage} alt="Edit" className="edit-leaf" />
              <span className="edit-text">edit</span>
            </div>

            {showBubble && (
              <div className="options-bubble">
                <div className="bubble-option" onClick={handleUploadPhotoClick}>Upload a photo...</div>
                <div className="bubble-option" onClick={handleRemovePhoto}>Remove photo</div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept="image/*" // You can restrict to image files
            />
          </div>
          {/* User Info Section */}
          <div className="user-info-section">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                className="info-text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="info-text"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          
            {/* Buttons Section */}
            <div className="button-group">
              {isEditing ? (
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
              ) : (
                <button className="edit-btn" onClick={toggleEdit}>
                  Edit Info
                </button>
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Profile;

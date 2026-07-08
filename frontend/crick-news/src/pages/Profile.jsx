import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/Profile.css";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await API.get(`/api/auth/${user.id}`);
        setProfile(res.data);
      } catch (error) {
        addToast("Failed to fetch user profile", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="profile-container">
        <p className="loading">Please login to view your profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <p className="loading">Failed to load profile details</p>
      </div>
    );
  }

  // Get initial for profile avatar
  const avatarLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-container">
      <div className="bg-spotlight"></div>
      
      <h2 className="profile-title">User Account</h2>

      <div className="profile-card">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">{avatarLetter}</div>
          <h3 className="profile-card-name">{profile.name}</h3>
          <span className="profile-role-badge">{profile.role}</span>
        </div>

        <div className="profile-divider"></div>

        <div className="profile-details-grid">
          <div className="profile-row">
            <span className="profile-label">Email Address</span>
            <span className="profile-value">{profile.email}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Member Since</span>
            <span className="profile-value">{new Date(profile.createdAt).toDateString()}</span>
          </div>

          <div className="profile-row">
            <span className="profile-label">Account Status</span>
            <span className="profile-value status-active">Active</span>
          </div>
        </div>

        <button onClick={logout} className="profile-logout-btn">
          <span>Logout Account</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/News_Api";
import "../styles/Profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [user]);

  if (!user) {
    return <p className="loading">Please login again</p>;
  }

  if (loading) {
    return <p className="loading">Loading profile...</p>;
  }

  if (!profile) {
    return <p className="loading">Failed to load profile</p>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-card">
        <p><span>Name:</span> {profile.name}</p>
        <p><span>Email:</span> {profile.email}</p>
        <p><span>Role:</span> {profile.role}</p>
        <p>
          <span>Joined:</span>{" "}
          {new Date(profile.createdAt).toDateString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;

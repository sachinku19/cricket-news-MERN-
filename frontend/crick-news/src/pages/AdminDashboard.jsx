import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "../styles/AdminDashboard.css";
import API from "../services/News_Api";

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/api/admin/stats");
        setStats(res.data);
      } catch (error) {
        addToast("Failed to retrieve dashboard analytics", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Loading analytics reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="bg-spotlight"></div>
      
      <div className="admin-header-section">
        <h2 className="admin-title">System Administration</h2>
        <p className="admin-subtitle">Monitor site traffic metrics, articles count, and moderation tools.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Users Registered</p>
            <h3 className="stat-value">{stats?.totalUser || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box">📰</div>
          <div className="stat-info">
            <p className="stat-label">Published Articles</p>
            <h3 className="stat-value">{stats?.totalNews || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box">🛡️</div>
          <div className="stat-info">
            <p className="stat-label">Moderators & Admins</p>
            <h3 className="stat-value">{stats?.totalAdmin || 0}</h3>
          </div>
        </div>
      </div>

      {/* Actions Panel */}
      <div className="admin-actions">
        <NavLink to="/add-news" className="admin-btn primary">
          <span>Create Article</span>
        </NavLink>
        <NavLink to="/admin/news" className="admin-btn primary">
          <span>Moderation Queue</span>
        </NavLink>
        <button onClick={logout} className="admin-btn danger">
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

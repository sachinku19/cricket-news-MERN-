import { useContext, useEffect ,useState} from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/AdminDashboard.css";
import API from "../services/News_Api";


const AdminDashboard = () => {
  
  const { logout } = useContext(AuthContext);

  const [stats, setstats] = useState(null);
  const [loading, setloading] = useState(true);

   useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/api/admin/stats");
        setstats(res.data);
      } catch (error) {
        console.error("Admin stats error", error);
      } finally {
        setloading(false);
      }
    };

    fetchStats();
  }, []);

    if (loading) return <p className="loading">Loading dashboard...</p>;


  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Users</p>
          <h3 className="stat-value">{stats.totalUser}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Total News</p>
          <h3 className="stat-value">{stats.totalNews}</h3>
        </div>

        <div className="stat-card">
          <p className="stat-label">Admins</p>
          <h3 className="stat-value">{stats.totalAdmin}</h3>
        </div>

      </div>

      {/* Actions */}
      <div className="admin-actions">
        <NavLink to="/add-news" className="admin-btn primary">Add News</NavLink>
        <NavLink to="/admin/news" className="admin-btn primary">Manage News</NavLink>
        <button onClick={logout} className="admin-btn danger">Logout</button>
      </div>
    </div>
  );
};

export default AdminDashboard;

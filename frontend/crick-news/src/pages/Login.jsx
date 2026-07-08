import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../services/News_Api";
import { useNavigate, NavLink } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import cricketLoginHero from "../assets/cricket_login_hero.png";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", formData);
      login(res.data);
      addToast("Welcome back! Login successful. ✅", "success");
      navigate("/");
    } catch (error) {
      addToast(error.response?.data?.message || "Authentication failed. Please verify credentials.", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="bg-spotlight"></div>
      
      <div className="auth-page-wrapper">
        {/* Visual Hero Side */}
        <div className="auth-hero-side">
          <img src={cricketLoginHero} alt="CricketZone Action" className="auth-hero-img" />
          <div className="auth-hero-overlay"></div>
          <div className="auth-hero-quote-box">
            <h2 className="auth-hero-brand">CricketZone</h2>
            <p className="auth-hero-quote">
              "To me, cricket is a simple game. Keep it simple and just go out and play."
            </p>
            <span className="auth-hero-author">— Sachin Tendulkar</span>
          </div>
        </div>

        {/* Form Input Side */}
        <div className="auth-form-side">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Login to access your sports news dashboard</p>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="auth-submit-btn" type="submit">Sign In</button>

            <p className="auth-redirect">
              Don't have an account? <NavLink to="/signup" className="auth-link">Sign Up</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import cricketLoginHero from "../assets/cricket_login_hero.png";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/auth/signup", formData);
      addToast("Account created successfully! Please sign in. ✅", "success");
      navigate("/login");
    } catch (error) {
      addToast(error.response?.data?.message || "Registration failed. Try again.", "error");
    }
  };

  return (
    <div className="signup-container">
      <div className="bg-spotlight"></div>
      
      <div className="auth-page-wrapper">
        {/* Visual Hero Side */}
        <div className="auth-hero-side">
          <img src={cricketLoginHero} alt="CricketZone Action" className="auth-hero-img" />
          <div className="auth-hero-overlay"></div>
          <div className="auth-hero-quote-box">
            <h2 className="auth-hero-brand">CricketZone</h2>
            <p className="auth-hero-quote">
              "Cricket is not just a game, it is a way of life."
            </p>
            <span className="auth-hero-author">— Harsha Bhogle</span>
          </div>
        </div>

        {/* Form Input Side */}
        <div className="auth-form-side">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2 className="form-title">Join CricketZone</h2>
              <p className="form-subtitle">Create a free account to follow matches and read insights</p>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleChange}
                required
              />
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

            <button className="auth-submit-btn" type="submit">Create Account</button>

            <p className="auth-redirect">
              Already have an account? <NavLink to="/login" className="auth-link">Sign In</NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

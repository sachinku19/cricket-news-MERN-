import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/News_Api";
import "../styles/Signup.css";


const Signup = () => {
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     await API.post("/auth/signup", formData);
      alert("signup success");
      navigate("/login");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="signup-container">
    <form className="signup-form" onSubmit={handleSubmit}>
      <h1>Signup</h1>

      <input
        type="text"
        name="name"
        placeholder="Enter Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  </div>
  );
};

export default Signup;

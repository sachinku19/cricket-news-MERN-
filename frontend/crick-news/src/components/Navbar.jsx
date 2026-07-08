import { NavLink } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <h2 className="logo">CricketZone</h2>

      <ul className="nav-links">
        <li>
          <NavLink to="/" end className="nav-item">
            Home
          </NavLink>
        </li>
      
        <li>
          <NavLink to="/live-match" end className="nav-item">
            Live Matches
          </NavLink>
        </li>
        <li>
          <NavLink to="/fixtures" end className="nav-item">
            Schedules
          </NavLink>
        </li>
        <li>
          <NavLink to="/teams" end className="nav-item">
            Teams & Ranks
          </NavLink>
        </li>
        

        {user?.role === "admin" && (
          <>
            <li>
              <NavLink to="/admin" className="nav-item">
                Admin
              </NavLink>
            </li>
            <li>
              <NavLink to="/add-news" className="nav-item">
                Add-News
              </NavLink>
            </li>
          </>
        )}

       {!user ? (
  <>
    <li>
      <NavLink to="/login" className="nav-item">
        Login
      </NavLink>
    </li>
    <li>
      <NavLink to="/signup" className="nav-item btn">
        Signup
      </NavLink>
    </li>
  </>
) : (
  <li className="profile" ref={dropdownRef}>
    <button className="profile-btn" onClick={() => setOpen(!open)}>
      {user.name}
      <span className={`arrow ${open ? "up" : ""}`}>▾</span>
    </button>

    {open && (
      <div className="dropdown">
        <NavLink
          to="/profile"
          className="dropdown-item"
          onClick={() => setOpen(false)}
        >
          Profile
        </NavLink>

        <button
          onClick={logout}
          className="dropdown-item logout"
        >
          Logout
        </button>
      </div>
    )}
  </li>
)}
      </ul>
    </nav>
  );
};

export default Navbar;

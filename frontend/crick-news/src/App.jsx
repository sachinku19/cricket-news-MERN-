import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminRoute from "./utils/AdminRoute";
import AddNews from "./pages/AddNews";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminNews from "./pages/AdminNews";
import EditNews from "./pages/EditNews";
import NewsDetails from "./pages/NewsDetails";
import LiveCricket from "./pages/LiveCricket";
import UpcomingCricket from "./pages/UpcomingCricket";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/live-match" element={<LiveCricket/>}/>
          <Route path="/upcoming-match" element={<UpcomingCricket/>}/>
          {/* Protected user route */}
          <Route
            path="/news/:id"
            element={
              <ProtectedRoute>
                <NewsDetails/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-news"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AddNews />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/news"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminNews />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit-news/:id"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <EditNews />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

import { useState } from "react";
import API from "../services/News_Api";
import "../styles/AddNews.css";

const AddNews = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", image);

    try {
      await API.post("/api/news/add-news", data);

      alert("News added successfully");

      setFormData({ title: "", description: "", category: "" });
      setImage(null);
      setPreview(null);
      e.target.reset(); // 🔥 reset file input
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-news-container">
      <h2 className="add-title">Add News (Admin)</h2>

      <form
        className="add-news-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="title"
          placeholder="News Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Full News Description"
          value={formData.description}
          onChange={handleChange}
          rows="6"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Team">Team</option>
          <option value="Player">Player</option>
          <option value="Match">Match</option>
          <option value="Tournament">Tournament</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />

        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Add News"}
        </button>
      </form>
    </div>
  );
};

export default AddNews;

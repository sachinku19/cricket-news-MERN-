import { useState } from "react";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/AddNews.css";

const AddNews = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= TEXT CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      addToast("Please select a cover image for the article", "info");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", image); // Cloudinary

    try {
      await API.post("/api/news/add-news", data);
      addToast("Article published successfully! ✅", "success");

      // RESET FORM
      setFormData({ title: "", description: "", category: "" });
      setImage(null);
      setPreview("");
      e.target.reset();
    } catch (error) {
      addToast(error.response?.data?.message || "Failed to publish article", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-news-container">
      <div className="bg-spotlight"></div>
      
      <h2 className="add-title">Add News Story</h2>

      <form
        className="add-news-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="input-group">
          <label className="field-label">Article Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g. India clinches historic victory against Australia"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label className="field-label">Category</label>
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
        </div>

        <div className="input-group">
          <label className="field-label">Description Content</label>
          <textarea
            name="description"
            placeholder="Write the full report details here..."
            value={formData.description}
            onChange={handleChange}
            rows="6"
            required
          />
        </div>

        <div className="input-group">
          <label className="field-label font-bold">Featured Image</label>
          <div className="file-input-wrapper">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        {preview && (
          <div className="preview-container">
            <p className="preview-label">Image Preview</p>
            <img src={preview} alt="Preview" className="image-preview" />
          </div>
        )}

        <button className="publish-btn" type="submit" disabled={loading}>
          {loading ? "Uploading to Cloud..." : "Publish Article"}
        </button>
      </form>
    </div>
  );
};

export default AddNews;

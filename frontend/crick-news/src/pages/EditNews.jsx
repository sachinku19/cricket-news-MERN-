import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/News_Api";
import { useToast } from "../context/ToastContext";
import "../styles/Editnews.css";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    imagePreview: "",
  });

  const [loading, setLoading] = useState(isEditMode);

  /* ================= LOAD NEWS (EDIT MODE) ================= */
  useEffect(() => {
    if (!isEditMode) return;

    const fetchSingleNews = async () => {
      try {
        const res = await API.get(`/api/news/${id}`);
        setForm({
          title: res.data.title,
          description: res.data.description,
          category: res.data.category,
          image: null,
          imagePreview: res.data.image, // Cloudinary URL
        });
      } catch (err) {
        addToast("Failed to load news article details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleNews();
  }, [id, isEditMode]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({
        ...form,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      if (isEditMode) {
        await API.put(`/api/news/edit-news/${id}`, formData);
        addToast("Article updated successfully! ✅", "success");
      } else {
        await API.post("/api/news/add-news", formData);
        addToast("Article published successfully! ✅", "success");
      }

      navigate("/admin/news");
    } catch (error) {
      addToast(error.response?.data?.message || "Operation failed. Try again.", "error");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="cricket-loading-box">
          <div className="spinner"></div>
          <p>Loading news details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="bg-spotlight"></div>
      
      <h2 className="admin-title">
        {isEditMode ? "Update Article" : "Create Article"}
      </h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="field-label">Article Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
        </div>

        <div className="input-group">
          <label className="field-label">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            required
          />
        </div>

        <div className="input-group">
          <label className="field-label">Description Content</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows="6"
            required
          />
        </div>

        <div className="input-group">
          <label className="field-label">Featured Image</label>
          <div className="file-input-wrapper">
            <input type="file" name="image" onChange={handleChange} />
          </div>
          {isEditMode && (
            <p className="hint-text">
              * Leave empty to keep the currently published image
            </p>
          )}
        </div>

        {/* IMAGE PREVIEW */}
        {form.imagePreview && (
          <div className="preview-container">
            <p className="preview-label">Image Preview</p>
            <img
              src={form.imagePreview}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}

        <button className="admin-btn primary" type="submit">
          {isEditMode ? "Save Changes" : "Publish Article"}
        </button>
      </form>
    </div>
  );
};

export default EditNews;

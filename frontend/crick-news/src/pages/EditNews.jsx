import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/News_Api";
import "../styles/Editnews.css";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    imagePreview: "",
  });

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
          imagePreview: res.data.image, // ✅ Cloudinary URL
        });
      } catch (err) {
        alert("Failed to load news");
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
      } else {
        await API.post("/api/news/add-news", formData);
      }

      navigate("/admin/news");
    } catch (error) {
      alert("Operation failed");
    }
  };

  return (
    <div className="admin-container">
      <h2 className="admin-title">
        {isEditMode ? "Update News" : "Add News"}
      </h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />

        <input type="file" name="image" onChange={handleChange} />

        {/* IMAGE PREVIEW */}
        {form.imagePreview && (
          <img
            src={form.imagePreview}
            alt="Preview"
            className="preview-image"
          />
        )}

        {isEditMode && (
          <p className="hint-text">
            Leave image empty to keep existing image
          </p>
        )}

        <button className="admin-btn primary" type="submit">
          {isEditMode ? "Update News" : "Add News"}
        </button>
      </form>
    </div>
  );
};

export default EditNews;

// components/CreatePost.js

"use client"; // Mark this as a Client Component

import React, { useState, useEffect } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [author, setAuthor] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoryId", categoryId);
    formData.append("author", author);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      console.log("Post created successfully");
      // Reset the form fields
      setTitle("");
      setContent("");
      setCategoryId("");
      setAuthor("");
      setImageFile(null);
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="image">Image:</label>
        <input
          type="file"
          id="image"
          onChange={(e) => setImageFile(e.target.files[0])}
          accept="image/*"
        />
      </div>
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/utils/dbconnection";
import "./createBlog.css";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching the current user
    const user = { id: 1, email: "cinimodazotrom@gmail.com" }; // Replace with actual user fetching logic
    setCurrentUser(user);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.query(
        "INSERT INTO posts (title, author, content, image_url, user_id) VALUES ($1, $2, $3, $4, $5)",
        [title, author, content, image, currentUser.id]
      );
      router.push("/blog");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-blog-container">
      <h1>Create a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="create-blog-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="create-blog-input"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="create-blog-input"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="create-blog-input"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-blog-textarea"
          required
        ></textarea>
        <button type="submit" className="create-blog-button">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;

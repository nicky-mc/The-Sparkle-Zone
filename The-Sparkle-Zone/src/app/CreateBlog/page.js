"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseclient";
import "./createBlog.css";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate fetching the current user
    const user = { id: 1, email: "cinimodazotrom@gmail.com" }; // Replace with actual user fetching logic
    setCurrentUser(user);
    if (user.email !== "cinimodazotrom@gmail.com") {
      router.push("/blog"); // Redirect if not authorized
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("your_bucket_name") // Replace with your actual bucket name
      .upload(fileName, file);

    if (error) {
      console.error("Error uploading image:", error);
      return;
    }

    const imageUrl = supabase.storage
      .from("your_bucket_name") // Replace with your actual bucket name
      .getPublicUrl(fileName).publicURL;

    setImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        author,
        content,
        image,
        userId: currentUser.id,
      }),
    });

    if (response.ok) {
      router.push("/blog");
    } else {
      console.error("Error creating post");
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

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
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-blog-textarea"
          required
        ></textarea>
        <input
          type="file"
          onChange={handleImageUpload}
          className="create-blog-input"
          required
        />
        <button type="submit" className="create-blog-button">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;

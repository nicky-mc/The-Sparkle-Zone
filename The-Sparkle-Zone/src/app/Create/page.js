"use client"; // Marks this component as a client component

import { useState } from "react";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category_id, setCategoryId] = useState("");

  const handleCreatePost = async () => {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, author, category_id }),
    });

    if (response.ok) {
      const post = await response.json();
      console.log("Post created:", post);
    } else {
      console.error("Failed to create post");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category ID"
        value={category_id}
        onChange={(e) => setCategoryId(e.target.value)}
      />
      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
}

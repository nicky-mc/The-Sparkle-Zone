"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./createAPost.css";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Store selected category ID
  const [categories, setCategories] = useState([]); // Store categories

  // Fetch categories when the page loads
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/posts"); // Fetch categories from the API route
        if (response.ok) {
          const data = await response.json();
          setCategories(data); // Populate the categories dropdown
        } else {
          console.error("Error fetching categories");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  // Handle form submission and create a new post
  const handleCreatePost = async () => {
    try {
      let imageBase64 = null;
      if (imageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = () => {
          imageBase64 = reader.result.split(",")[1];
        };
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          imageFile: imageBase64,
          author,
          category_id: categoryId || null, // Send the selected category ID or null
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push("/Blog"); // Redirect to Blog after creating the post
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>
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
      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      {/* Category dropdown */}
      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)} // Set the selected category ID
      >
        <option value="">Select a Category (Optional)</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button onClick={handleCreatePost}>Create Post</button>
    </div>
  );
}

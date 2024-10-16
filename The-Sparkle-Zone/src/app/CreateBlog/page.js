"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/utils/supabaseclient";
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
    const { error } = await supabase.from("posts").insert({
      title,
      author,
      content,
      image_url: image,
      user_id: currentUser.id,
    });

    if (error) {
      console.error("Error creating post:", error);
    } else {
      router.push("/blog");
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

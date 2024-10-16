"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./blog.css";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-container">
      <h1>Blog Posts</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul className="blog-list">
        {filteredPosts.map((post) => (
          <li key={post.id} className="blog-item">
            <Link href={`/Blog/${post.id}`}>
              <a className="blog-link">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="blog-image"
                />
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-author">By {post.author}</p>
                <p className="blog-summary">
                  {post.content.substring(0, 100)}...
                </p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blog;

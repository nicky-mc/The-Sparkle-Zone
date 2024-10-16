import { useState, useEffect } from "react";
import Link from "next/link";
import "./blog.css";
import db from "../../utils/dbconnection";

export const getPosts = async () => {
  const posts = await db.query("SELECT * FROM posts");
  wrangleData(posts);
  return posts.rows.map((post) => ({
    id: post.id,
    image: post.image_url, // Ensure this matches your database schema
    title: post.title,
    author: post.author,
    content: post.content.substring(0, 100), // Assuming the start of the content is the first 100 characters
  }));

  function wrangleData(posts) {
    posts.rows.forEach((post) => {
      post.created_at = new Date(post.created_at).toLocaleString();
    });
  }
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await getPosts();
      setPosts(postsData);
    };
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <div className="posts-list">
        {filteredPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <div className="post-card">
              <img src={post.image} alt={post.title} className="post-image" />
              <h2 className="post-title">{post.title}</h2>
              <p className="post-author">By {post.author}</p>
              <p className="post-excerpt">{post.content}...</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;

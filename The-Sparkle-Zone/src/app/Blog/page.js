import { db } from "@/utils/dbconnection";
import React from "react";
import "./blog.css";

export default async function Page() {
  let posts = [];
  try {
    const result = await db.query(`
      SELECT posts.*, categories.name as category
      FROM posts
      LEFT JOIN categories ON posts.category_id = categories.id
    `);
    posts = result.rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="blog_container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="blog_item">
            <h4 className="category">{post.category}</h4>
            <h2 className="title">{post.title}</h2>
            <h3 className="author">{post.author}</h3>
            <img src={post.image_url} alt="blog image" className="image" />
            <p className="content">{post.content}</p>
            <p className="date">{post.date}</p>
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
}

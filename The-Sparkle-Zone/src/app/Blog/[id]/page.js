// src/app/Blog/[id]/page.js

"use client"; // Mark this as a Client Component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Make sure to import useRouter
import Link from "next/link"; // For navigation
import "../blog.css"; // Your CSS file

const PostDetailPage = () => {
  const router = useRouter(); // Get router instance
  const { id } = router.query; // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!id) return; // Exit if ID is not available

      try {
        const postResponse = await fetch(`/api/posts/${id}`); // Fetch post details
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();
        setPost(postData);

        const commentsResponse = await fetch(`/api/posts/${id}/comments`); // Fetch comments
        if (!commentsResponse.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]); // Run the effect when ID changes

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }), // Send the new comment
      });

      if (!response.ok) throw new Error("Failed to add comment");
      const newCommentData = await response.json();
      setComments((prevComments) => [...prevComments, newCommentData]); // Update comments
      setNewComment(""); // Reset input field
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="post-detail-container">
      <h1>{post.title}</h1>
      <h3>{post.author}</h3>
      {post.image_url && <img src={post.image_url} alt={post.title} />}
      <p>{post.content}</p>

      <h2>Comments</h2>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <Link href="/Blog">Back to Blog</Link>
    </div>
  );
};

export default PostDetailPage;

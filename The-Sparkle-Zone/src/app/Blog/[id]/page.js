"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "@/utils/dbconnection";
import "../blog.css";

const PostPage = ({ params }) => {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching the current user
    const user = { id: 1, email: "cinimodazotrom@gmail.com" }; // Replace with actual user fetching logic
    setCurrentUser(user);

    const fetchPost = async () => {
      try {
        const result = await db.query("SELECT * FROM posts WHERE id = $1", [
          id,
        ]);
        setPost(result.rows[0]);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const result = await db.query(
          "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
          [id]
        );
        setComments(result.rows);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.query(
        "INSERT INTO comments (post_id, author, content) VALUES ($1, $2, $3)",
        [id, newComment.author, newComment.content]
      );
      setNewComment({ author: "", content: "" });
      const result = await db.query(
        "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
        [id]
      );
      setComments(result.rows);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeletePost = async () => {
    if (post.user_id === currentUser.id) {
      try {
        await db.query("DELETE FROM posts WHERE id = $1", [id]);
        router.push("/blog");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    } else {
      alert("You are not authorized to delete this post.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await db.query("DELETE FROM comments WHERE id = $1", [commentId]);
      const result = await db.query(
        "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
        [id]
      );
      setComments(result.rows);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await db.query("INSERT INTO likes (comment_id) VALUES ($1)", [commentId]);
      const result = await db.query(
        "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
        [id]
      );
      setComments(result.rows);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-container">
      <Link href="/blog">
        <a className="return-button">Return to Blog</a>
      </Link>
      <h1 className="post-title">{post.title}</h1>
      <img src={post.image_url} alt={post.title} className="post-image" />
      <p className="post-author">By {post.author}</p>
      <p className="post-content">{post.content}</p>
      {currentUser && post.user_id === currentUser.id && (
        <button onClick={handleDeletePost} className="delete-button">
          Delete Post
        </button>
      )}

      <div className="comments-section">
        <h2 className="comments-title">Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p className="comment-author">{comment.author}</p>
            <p className="comment-content">{comment.content}</p>
            <p className="comment-date">
              {new Date(comment.created_at).toLocaleString()}
            </p>
            <button
              onClick={() => handleLike(comment.id)}
              className="like-button"
            >
              Like
            </button>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="delete-comment-button"
            >
              Delete
            </button>
          </div>
        ))}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            placeholder="Your name"
            value={newComment.author}
            onChange={(e) =>
              setNewComment({ ...newComment, author: e.target.value })
            }
            className="comment-input"
            required
          />
          <textarea
            placeholder="Your comment"
            value={newComment.content}
            onChange={(e) =>
              setNewComment({ ...newComment, content: e.target.value })
            }
            className="comment-textarea"
            required
          ></textarea>
          <button type="submit" className="comment-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostPage;

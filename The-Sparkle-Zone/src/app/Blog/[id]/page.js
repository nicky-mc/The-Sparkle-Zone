"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../blog.css";

const PostPage = ({ params }) => {
  const { id } = params;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate fetching the current user
    const user = { id: 1, email: "cinimodazotrom@gmail.com" }; // Replace with actual user fetching logic
    setCurrentUser(user);

    const fetchPost = async () => {
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    };

    const fetchComments = async () => {
      const response = await fetch(`/api/posts/${id}/comments`);
      const data = await response.json();
      setComments(data);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: newComment.author,
        content: newComment.content,
        userId: currentUser.id,
      }),
    });
    setNewComment({ author: "", content: "" });
    const response = await fetch(`/api/posts/${id}/comments`);
    const data = await response.json();
    setComments(data);
  };

  const handleDeletePost = async () => {
    if (post.user_id === currentUser.id) {
      await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
      router.push("/blog");
    } else {
      alert("You are not authorized to delete this post.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    await fetch(`/api/posts/${id}/comments/${commentId}`, {
      method: "DELETE",
    });
    const response = await fetch(`/api/posts/${id}/comments`);
    const data = await response.json();
    setComments(data);
  };

  const handleLike = async (commentId) => {
    await fetch(`/api/posts/${id}/comments/${commentId}/like`, {
      method: "POST",
    });
    const response = await fetch(`/api/posts/${id}/comments`);
    const data = await response.json();
    setComments(data);
  };

  if (!post || !currentUser) {
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
      {post.user_id === currentUser.id && (
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

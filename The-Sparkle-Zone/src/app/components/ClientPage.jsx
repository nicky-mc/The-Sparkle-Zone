"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "../Blog/blog.css";

const LOGIN_CREDENTIALS = {
  username: "nicky_mc",
  password: "Charlie1978!",
};

export default function BlogPostPage({ post, comments: initialComments }) {
  const router = useRouter();
  const { id } = router.query;
  const [comments, setComments] = useState(initialComments);
  const [likes, setLikes] = useState({});
  const [newComment, setNewComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    comments.forEach((comment) => fetchLikes(comment.id));
  }, [comments]);

  const fetchLikes = async (commentId) => {
    const response = await fetch(`/api/likes?comment_id=${commentId}`);
    const data = await response.json();
    setLikes((prevLikes) => ({ ...prevLikes, [commentId]: data.length }));
  };

  const handleAddComment = async () => {
    await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: id,
        name: "Anonymous",
        content: newComment,
        location: "Unknown",
      }),
    });
    setNewComment("");
    fetchComments();
  };

  const fetchComments = async () => {
    const response = await fetch(`/api/comments?post_id=${id}`);
    const data = await response.json();
    setComments(data);
    data.forEach((comment) => fetchLikes(comment.id));
  };

  const handleLogin = (username, password) => {
    if (
      username === LOGIN_CREDENTIALS.username &&
      password === LOGIN_CREDENTIALS.password
    ) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  const handleDeletePost = async () => {
    if (isLoggedIn) {
      await fetch("/api/posts", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      router.push("/Blog");
    } else {
      alert("Login to delete this post.");
    }
  };

  const handleEditPost = () => {
    if (isLoggedIn) {
      router.push(`/Blog/edit/${id}`);
    } else {
      alert("Login to edit this post.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    await fetch("/api/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: commentId }),
    });
    fetchComments();
  };

  const handleEditComment = async (commentId, content) => {
    const updatedContent = prompt("Edit comment:", content);
    if (updatedContent && updatedContent !== content) {
      await fetch("/api/comments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: commentId, content: updatedContent }),
      });
      fetchComments();
    }
  };

  const handleLikeComment = async (commentId) => {
    await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment_id: commentId }),
    });
    fetchLikes(commentId);
  };

  const handleUnlikeComment = async (likeId, commentId) => {
    await fetch("/api/likes", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: likeId }),
    });
    fetchLikes(commentId);
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <p className="text-gray-700 mb-4">{post.content}</p>

      {isLoggedIn && (
        <div className="mb-4">
          <button
            className="btn bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleDeletePost}
          >
            Delete Post
          </button>
          <button
            className="btn bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleEditPost}
          >
            Edit Post
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <div className="login-section mb-4">
          <h3 className="text-xl mb-2">Login to Edit/Delete Post</h3>
          <input
            type="text"
            placeholder="Username"
            id="username"
            className="border p-2 mb-2 w-full"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="border p-2 mb-2 w-full"
          />
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() =>
              handleLogin(
                document.getElementById("username").value,
                document.getElementById("password").value
              )
            }
          >
            Login
          </button>
          {loginError && <p className="text-red-500 mt-2">{loginError}</p>}
        </div>
      )}

      <div className="comments-section">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="comment mb-4 p-4 border rounded-md">
            <p className="text-gray-700">{comment.content}</p>
            <p className="text-sm text-gray-500">
              Likes: {likes[comment.id] || 0}
            </p>
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
              onClick={() => handleLikeComment(comment.id)}
            >
              Like
            </button>
            {isLoggedIn && (
              <>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                  onClick={() => handleEditComment(comment.id, comment.content)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="border p-2 w-full mb-2"
          placeholder="Add a comment..."
        />
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/utils/supabaseclient";
import "./blog.css";

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
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
      } else {
        setPost(data);
      }
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data);
      }
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("comments").insert({
      post_id: id,
      author: newComment.author,
      content: newComment.content,
    });

    if (error) {
      console.error("Error adding comment:", error);
    } else {
      setNewComment({ author: "", content: "" });
      const { data, error: fetchError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching comments:", fetchError);
      } else {
        setComments(data);
      }
    }
  };

  const handleDeletePost = async () => {
    if (post.user_id === currentUser.id) {
      const { error } = await supabase.from("posts").delete().eq("id", id);

      if (error) {
        console.error("Error deleting post:", error);
      } else {
        router.push("/blog");
      }
    } else {
      alert("You are not authorized to delete this post.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
    } else {
      const { data, error: fetchError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching comments:", fetchError);
      } else {
        setComments(data);
      }
    }
  };

  const handleLike = async (commentId) => {
    const { error } = await supabase.from("likes").insert({
      comment_id: commentId,
    });

    if (error) {
      console.error("Error liking comment:", error);
    } else {
      const { data, error: fetchError } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("Error fetching comments:", fetchError);
      } else {
        setComments(data);
      }
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

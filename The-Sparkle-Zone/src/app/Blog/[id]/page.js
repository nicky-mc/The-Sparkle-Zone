import { useRouter } from "next/router";
import db from "The-Sparkle-Zone/src/utils/dbconnection.js";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../blog.css";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ author: "", content: "" });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Simulate fetching the current user
    const user = { id: 1, email: "cinimodazotrom@gmail.com" }; // Replace with actual user fetching logic
    setCurrentUser(user);

    if (id) {
      const fetchPost = async () => {
        const result = await db.query("SELECT * FROM posts WHERE id = $1", [
          id,
        ]);
        if (result.rows.length > 0) {
          setPost(result.rows[0]);
        }
      };
      const fetchComments = async () => {
        const result = await db.query(
          "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
          [id]
        );
        setComments(result.rows);
      };
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await db.query(
      "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)",
      [id, currentUser.id, newComment.content]
    );
    setNewComment({ author: "", content: "" });
    const result = await db.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [id]
    );
    setComments(result.rows);
  };

  const handleDeletePost = async () => {
    if (post.user_id === currentUser.id) {
      await db.query("DELETE FROM posts WHERE id = $1", [id]);
      router.push("/blog");
    } else {
      alert("You are not authorized to delete this post.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    await db.query("DELETE FROM comments WHERE id = $1", [commentId]);
    const result = await db.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [id]
    );
    setComments(result.rows);
  };

  const handleLike = async (commentId) => {
    await db.query("INSERT INTO likes (comment_id, user_id) VALUES ($1, $2)", [
      commentId,
      currentUser.id,
    ]);
    const result = await db.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [id]
    );
    setComments(result.rows);
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

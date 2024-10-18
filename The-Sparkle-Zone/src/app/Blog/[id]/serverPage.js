import { db } from "@/utils/dbconnection";
import BlogPostPage from "../../components/ClientPage.jsx";

export default async function ServerPage({ params }) {
  const { id } = params;
  let post = null;
  let comments = [];

  try {
    const postResult = await db.query(
      `
      SELECT * FROM posts WHERE id = $1
    `,
      [id]
    );
    post = postResult.rows[0];

    const commentsResult = await db.query(
      `
      SELECT * FROM comments WHERE post_id = $1
    `,
      [id]
    );
    comments = commentsResult.rows;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const handleAddComment = async (comment) => {
    try {
      const { post_id, name, content, location } = comment;
      const { data, error } = await db.query(
        `
        INSERT INTO comments (post_id, name, content, location)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
        [post_id, name, content, location]
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const { data, error } = await db.query(
        `
        DELETE FROM posts WHERE id = $1
        RETURNING *
      `,
        [postId]
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const handleEditPost = async (post) => {
    try {
      const { id, title, content, image_url, author, category_id } = post;
      const { data, error } = await db.query(
        `
        UPDATE posts
        SET title = $1, content = $2, image_url = $3, author = $4, category_id = $5
        WHERE id = $6
        RETURNING *
      `,
        [title, content, image_url, author, category_id, id]
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error editing post:", error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const { data, error } = await db.query(
        `
        DELETE FROM comments WHERE id = $1
        RETURNING *
      `,
        [commentId]
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  const handleEditComment = async (comment) => {
    try {
      const { id, content } = comment;
      const { data, error } = await db.query(
        `
        UPDATE comments
        SET content = $1
        WHERE id = $2
        RETURNING *
      `,
        [content, id]
      );
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error editing comment:", error);
      throw error;
    }
  };

  return (
    <BlogPostPage
      post={post}
      comments={comments}
      handleAddComment={handleAddComment}
      handleDeletePost={handleDeletePost}
      handleEditPost={handleEditPost}
      handleDeleteComment={handleDeleteComment}
      handleEditComment={handleEditComment}
    />
  );
}

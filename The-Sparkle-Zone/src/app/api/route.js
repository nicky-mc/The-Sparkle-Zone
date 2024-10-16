import { NextResponse } from "next/server";
import pg from "pg";

const dbConnectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db = new pg.Pool({
  connectionString: dbConnectionString,
});

export async function GET(request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const id = pathSegments[1];
  const isComment = pathSegments.includes("comments");

  if (id && !isComment) {
    // Fetch a single post by ID
    try {
      const result = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
      if (result.rows.length > 0) {
        return NextResponse.json(result.rows[0]);
      } else {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Error fetching post" },
        { status: 500 }
      );
    }
  } else if (isComment) {
    // Fetch comments for a post
    try {
      const result = await db.query(
        "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
        [id]
      );
      return NextResponse.json(result.rows);
    } catch (error) {
      return NextResponse.json(
        { error: "Error fetching comments" },
        { status: 500 }
      );
    }
  } else {
    // Fetch all posts
    try {
      const result = await db.query("SELECT * FROM posts");
      return NextResponse.json(result.rows);
    } catch (error) {
      return NextResponse.json(
        { error: "Error fetching posts" },
        { status: 500 }
      );
    }
  }
}

export async function POST(request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const id = pathSegments[1];
  const isComment = pathSegments.includes("comments");

  if (id && isComment) {
    // Add a new comment to a post
    const { author, content, userId } = await request.json();
    try {
      await db.query(
        "INSERT INTO comments (post_id, user_id, author, content) VALUES ($1, $2, $3, $4)",
        [id, userId, author, content]
      );
      return NextResponse.json({ message: "Comment added successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error adding comment" },
        { status: 500 }
      );
    }
  } else {
    // Create a new post
    const { title, author, content, image, userId } = await request.json();
    try {
      await db.query(
        "INSERT INTO posts (title, author, content, image_url, user_id) VALUES ($1, $2, $3, $4, $5)",
        [title, author, content, image, userId]
      );
      return NextResponse.json({ message: "Post created successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error creating post" },
        { status: 500 }
      );
    }
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const id = pathSegments[1];
  const isComment = pathSegments.includes("comments");

  if (id && isComment) {
    // Delete a comment by ID
    const commentId = pathSegments[3];
    try {
      await db.query("DELETE FROM comments WHERE id = $1", [commentId]);
      return NextResponse.json({ message: "Comment deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error deleting comment" },
        { status: 500 }
      );
    }
  } else {
    // Delete a post by ID
    try {
      await db.query("DELETE FROM posts WHERE id = $1", [id]);
      return NextResponse.json({ message: "Post deleted successfully" });
    } catch (error) {
      return NextResponse.json(
        { error: "Error deleting post" },
        { status: 500 }
      );
    }
  }
}

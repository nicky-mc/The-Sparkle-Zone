import { NextResponse } from "next/server";
import db from "@/utils/dbconnection";
// Handle POST requests
export async function POST(req) {
  try {
    const { title, content, author, category_id } = await req.json();

    const result = await db.query(
      "INSERT INTO posts (title, content, author, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, content, author, category_id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.error(new Error("Failed to create post"), 500);
  }
}

// Handle GET requests (optional)
export async function GET() {
  try {
    const result = await db.query("SELECT * FROM posts");

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.error(new Error("Failed to fetch posts"), 500);
  }
}

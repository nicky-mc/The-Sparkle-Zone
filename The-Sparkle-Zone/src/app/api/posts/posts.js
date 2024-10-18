// src/app/api/posts/route.js

import { NextResponse } from "next/server";
import { db } from "@/utils/dbconnection"; // Adjust the path to your dbconnection
import multer from "multer";
import formidable from "formidable"; // Use formidable for handling file uploads in Next.js

// Configure formidable for handling file uploads
export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

// GET all posts
export async function GET(req) {
  try {
    const result = await pool.query(`
      SELECT id, title, author, content, image_url, created_at, category_id 
      FROM posts 
      ORDER BY created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}

// POST a new post
export async function POST(req) {
  const form = formidable({ multiples: false }); // Create a formidable instance
  const parsedData = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const { title, content, categoryId, author } = parsedData.fields; // Get form fields
  let imageUrl = null;

  // Handle file upload if present
  if (parsedData.files.image) {
    const fileName = `${Date.now()}-${parsedData.files.image[0].originalFilename}`;
    imageUrl = `/uploads/${fileName}`; // Set image URL for the post
    // Here you would typically move the file to your desired location
    // fs.renameSync(parsedData.files.image[0].filepath, `public/uploads/${fileName}`);
  }

  try {
    const result = await pool.query(
      "INSERT INTO posts (title, author, content, category_id, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, content, categoryId, imageUrl]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error.message);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

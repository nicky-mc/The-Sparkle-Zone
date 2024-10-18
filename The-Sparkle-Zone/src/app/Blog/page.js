import { db } from "@/utils/dbconnection";
import React from "react";
import Link from "next/link";
import "./blog.css";

export default async function Page() {
  let posts = [];
  try {
    const result = await db.query(`
      SELECT posts.*, categories.name as category
      FROM posts
      LEFT JOIN categories ON posts.category_id = categories.id
    `);
    posts = result.rows;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <div className="container mx-auto p-4">
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link key={post.id} href={`/Blog/${post.id}`}>
              <div className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer">
                <h4 className="text-sm text-gray-500">{post.category}</h4>
                <h2 className="text-xl font-bold text-gray-800">
                  {post.title}
                </h2>
                <h3 className="text-md text-gray-600">{post.author}</h3>
                <img
                  src={post.image_url}
                  alt="blog image"
                  className="w-full h-48 object-cover rounded-md mt-2"
                />
                <p className="text-gray-700 mt-2">
                  {post.content.substring(0, 50)}...
                </p>
                <p className="text-sm text-gray-500 mt-2">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No posts available</p>
      )}
    </div>
  );
}

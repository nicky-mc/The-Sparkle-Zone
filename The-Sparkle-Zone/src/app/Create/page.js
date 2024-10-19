import { db } from "@/utils/dbconnection";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  "https://hasatlmjddrwgmaaosen.supabase.co", // Supabase project URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhhc2F0bG1qZGRyd2dtYWFvc2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNzMzNzYsImV4cCI6MjA0NDY0OTM3Nn0.VdbiBT7ArnJF7sVJn8QYbpdWXXbqdNUvIL2xrIfdsWc" // Supabase anon key
);

// Define the server-side action that handles form submission
export async function handleSubmit(formData) {
  "use server"; // Ensure this runs on the server

  const title = formData.get("title");
  const content = formData.get("content");
  const author = formData.get("author");
  const category = formData.get("category");
  const photo = formData.get("photo");
  let imageUrl = null;

  // Check if a photo is uploaded (optional)
  if (photo && photo.size > 0) {
    const uniqueFilename = `${Date.now()}-${photo.name}`;

    // Upload the photo to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from("image_for_url") // Replace with your bucket name
      .upload(uniqueFilename, photo);
    if (uploadError) {
      console.error("Error uploading photo:", uploadError.message);
      return {
        success: false,
        message: "Error uploading photo: " + uploadError.message,
      };
    }

    // Construct the image URL using the unique filename
    imageUrl = `https://hasatlmjddrwgmaaosen.supabase.co/storage/v1/s3/image_for_url/${uniqueFilename}`;

    // Log the constructed image URL for debugging
    console.log("Constructed image URL:", imageUrl);
  }

  // Check if the category exists in the categories table
  let categoryResult = await db.query(
    "SELECT id FROM categories WHERE name = $1",
    [category]
  );
  let category_id;
  if (categoryResult.rows.length === 0) {
    const insertCategoryResult = await db.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id",
      [category]
    );
    category_id = insertCategoryResult.rows[0].id;
  } else {
    category_id = categoryResult.rows[0].id;
  }

  // Insert the new post into the posts table
  const { error: postError } = await db.query(
    "INSERT INTO posts (title, content, author, category_id, image_url) VALUES ($1, $2, $3, $4, $5)",
    [title, content, author, category_id, imageUrl]
  );

  if (postError) {
    console.error("Error inserting post:", postError.message);
    return {
      success: false,
      message: "Error inserting post: " + postError.message,
    };
  }

  // If everything is successful, redirect to the blog page
  redirect("/Blog");

  // Revalidate the blog page after submission
  revalidatePath("/Blog");

  return {
    success: true,
    message: "Redirecting to /Blog", // Optional message for clarity
  };
}

export default function CreateBlogPage() {
  // Render the form
  return (
    <>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Create a New Blog Post
      </h1>
      <form
        action={handleSubmit}
        className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-lg mx-auto"
      >
        {/* Blog Title */}
        <label
          htmlFor="title"
          className="block text-lg font-semibold mb-2 text-gray-900"
        >
          Title:
        </label>{" "}
        <input
          type="text"
          name="title"
          id="title"
          placeholder="Enter your blog title"
          required
          className="w-full p-3 mb-4 border border-gray-400 rounded-lg bg-gray-100 text-gray-900"
        />
        {/* Blog Author */}
        <label
          htmlFor="author"
          className="block text-lg font-semibold mb-2 text-gray-900"
        >
          Author:
        </label>
        <input
          type="text"
          name="author"
          id="author"
          placeholder="Author name"
          required
          className="w-full p-3 mb-4 border border-gray-400 rounded-lg bg-gray-100 text-gray-900"
        />
        {/* Blog Category */}
        <label
          htmlFor="category"
          className="block text-lg font-semibold mb-2 text-gray-900"
        >
          Category:
        </label>
        <input
          type="text"
          name="category"
          id="category"
          placeholder="Enter the category"
          required
          className="w-full p-3 mb-4 border border-gray-400 rounded-lg bg-gray-100 text-gray-900"
        />
        {/* Blog Photo */}
        <label
          htmlFor="photo"
          className="block text-lg font-semibold mb-2 text-gray-900"
        >
          Upload Photo (Optional):
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          className="w-full p-3 mb-4 border border-gray-400 rounded-lg bg-gray-100 text-gray-900"
        />
        {/* Blog Content */}
        <label
          htmlFor="content"
          className="block text-lg font-semibold mb-2 text-gray-900"
        >
          Content:
        </label>
        <textarea
          name="content"
          id="content"
          placeholder="Write your blog post here"
          required
          className="w-full p-3 mb-4 border border-gray-400 rounded-lg bg-gray-100 text-gray-900"
        />
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Submit Blog Post
        </button>
      </form>
    </>
  );
}

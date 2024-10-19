import { db } from "@/utils/dbconnection";
import { supabase } from "@/utils/supabaseClient"; // Adjust the import path as necessary
import Image from "next/image"; // Import the Image component

export default async function BlogPostPage({ params }) {
  const { id } = params; // Extract post id from params

  // Fetch the blog post by id
  const postResult = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
  const post = postResult.rows[0];

  if (!post) {
    return <p>Post not found.</p>;
  }

  // Extract the filename from the image_url if it contains a full URL
  const imageFilename = post.image_url.split("/").pop(); // Get the last part of the URL
  const imageUrl = `https://hasatlmjddrwgmaaosen.supabase.co/storage/v1/object/public/image_for_url/${imageFilename}`;

  // Check if the image URL is valid
  const isImageValid = await checkImageExists(imageUrl);

  return (
    <div className="blog-post p-4">
      <div className="flex flex-wrap md:flex-nowrap">
        {" "}
        {/* Use flex-wrap on smaller screens */}
        {isImageValid ? (
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            {" "}
            {/* Adjust for spacing */}
            <Image
              src={imageUrl}
              alt={post.title}
              width={300} // Adjusted width for larger image
              height={200} // Adjusted height for larger image
              className="w-full h-auto object-cover rounded-md" // Ensure responsive and rounded
              priority // Add priority property
            />
          </div>
        ) : (
          <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
            <img
              src="/images/placeholder.jpg" // Updated path to the placeholder image
              alt="Placeholder"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        )}
        <div className="w-full md:w-2/3 md:pl-6">
          <h1 className="text-3xl font-bold font-raleway mb-2">{post.title}</h1>
          <p className="text-gray-600 mb-4">Author: {post.author}</p>
          <div className="content">
            <p>{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Function to check if the image exists
async function checkImageExists(url) {
  try {
    console.log("Checking image URL:", url); // Log the URL for debugging
    const res = await fetch(url, { method: "HEAD" });
    return res.ok; // Returns true if the image exists
  } catch (error) {
    console.error("Error checking image:", error);
    return false; // Return false if there's an error
  }
}

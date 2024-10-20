// src/app/Blog/[id]/page.js
import { db } from "@/utils/dbconnection";
import Image from "next/image";
import Link from "next/link";
import PostContent from "@/app/components/PostContent";
import CommentsSection from "@/app/components/CommentsSection";

export default async function BlogPostPage({ params }) {
  const { id } = params; // Get the post ID from the URL parameters

  // Fetch the blog post by id
  let post;
  try {
    const postResult = await db.query("SELECT * FROM posts WHERE id = $1", [
      id,
    ]);
    post = postResult.rows[0];
  } catch (error) {
    console.error("Error fetching post:", error);
    return <p>Error fetching post. Please try again later.</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  // Extract the filename from the image_url if it contains a full URL
  const imageFilename = post.image_url.split("/").pop();
  const imageUrl = `https://hasatlmjddrwgmaaosen.supabase.co/storage/v1/object/public/image_for_url/${imageFilename}`;

  return (
    <div className="blog-post p-4 bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 dark:bg-black transition-colors duration-300 min-h-screen">
      <div className="md:grid md:grid-cols-3 gap-4 flex flex-col">
        <div className="relative w-full col-span-1 mb-4 md:mb-0">
          <Image
            src={imageUrl}
            alt={post.title}
            width={300}
            height={200}
            className="w-full h-auto object-cover rounded-md"
            priority
          />
        </div>

        {/* Render PostContent component with post data */}
        <div className="col-span-2 content-container bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg transition-colors duration-300">
          <PostContent post={post} />{" "}
          {/* Pass the post object to PostContent */}
          <CommentsSection post={post} />{" "}
          {/* Pass the post object to CommentsSection */}
          {/* Link to return to the blog list */}
          <div className="mt-8">
            <Link
              href="/Blog"
              className="text-blue-500 dark:text-pink-300 hover:underline text-lg"
            >
              ← Back to My Other Ramblings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

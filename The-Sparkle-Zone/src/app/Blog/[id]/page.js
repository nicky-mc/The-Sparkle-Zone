import { db } from "@/utils/dbconnection";
import Link from "next/link";

export default async function BlogPostPage({ params }) {
  const { id } = params;
  let post = null;

  try {
    const postResult = await db.query(
      `
      SELECT * FROM posts WHERE id = $1
    `,
      [id]
    );
    post = postResult.rows[0];
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <p className="text-gray-700 mb-4">{post.content}</p>
        <Link href="/Blog" className="text-blue-500 hover:underline">
          Back to Blog
        </Link>
      </div>
    </div>
  );
}

import { db } from "@/utils/dbconnection";
import Link from "next/link";
import Image from "next/image";

// Fetch posts from the database
async function getPosts(searchQuery) {
  if (searchQuery) {
    const searchQueryLower = `%${searchQuery.toLowerCase()}%`;
    const res = await db.query(
      `SELECT * FROM posts WHERE LOWER(title) LIKE $1 OR LOWER(author) LIKE $2`,
      [searchQueryLower, searchQueryLower]
    );
    return res.rows;
  } else {
    const res = await db.query(`SELECT * FROM posts`);
    return res.rows;
  }
}

export default async function BlogListPage({ searchParams }) {
  const searchQuery = searchParams?.search || "";

  // Fetch posts from the database
  const posts = await getPosts(searchQuery);

  return (
    <div
      className="container mx-auto p-4 bg-gradient-to-b from-blue-400 via-pink-300 to-blue-400 dark:bg-black text-white dark:text-white transition-colors duration-300"
      style={{ fontFamily: "Raleway, sans-serif" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-500 dark:text-pink-300">
        Welcome to My Many Ramblings
      </h1>

      {/* Search form - uses GET to pass the search query in the URL */}
      <form method="GET" className="mb-6 flex justify-center">
        <input
          type="text"
          name="search"
          placeholder="Search by title or author"
          defaultValue={searchQuery}
          className="border p-2 rounded-l-lg w-64 bg-white text-black dark:bg-gray-800 dark:text-white"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg dark:bg-gray-600 dark:text-black"
        >
          Search
        </button>
      </form>

      {/* Render the filtered list of posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No posts found.
          </p>
        ) : (
          posts.map((post) => {
            // Extract the filename from the image_url if it contains a full URL
            const imageFilename = post.image_url.split("/").pop();
            const imageUrl = `https://hasatlmjddrwgmaaosen.supabase.co/storage/v1/object/public/image_for_url/${imageFilename}`;

            return (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
              >
                {/* Use Link to navigate to the detailed post page */}
                <Link
                  href={`/Blog/${post.id}`}
                  className="text-lg font-bold text-blue-500 hover:underline dark:text-blue-400"
                >
                  {post.title}
                </Link>
                <p className="text-gray-600 dark:text-gray-400">
                  Author: {post.author}
                </p>

                {/* Display the image if it exists */}
                {post.image_url && (
                  <div className="my-2">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  </div>
                )}

                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  {post.content.slice(0, 50)}...{" "}
                  <span className="text-blue-500 dark:text-blue-400">
                    To Read more Click the Title
                  </span>
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

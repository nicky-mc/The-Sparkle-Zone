import { db } from "@/utils/dbconnection";
import Link from "next/link";

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-amber-600">
        Blog Posts
      </h1>

      {/* Search form - uses GET to pass the search query in the URL */}
      <form method="GET" className="mb-6 flex justify-center">
        <input
          type="text"
          name="search"
          placeholder="Search by title or author"
          defaultValue={searchQuery}
          className="border p-2 rounded-l-lg w-64"
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-r-lg"
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
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              {/* Use Link to navigate to the detailed post page */}
              <Link
                href={`/Blog/${post.id}`}
                className="text-lg font-bold text-blue-500 hover:underline"
              >
                {post.title}
              </Link>
              <p className="text-gray-600">Author: {post.author}</p>
              <p className="text-gray-700 mt-2">
                {post.content.slice(0, 50)}...{" "}
                <span className="text-blue-500">Read more</span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

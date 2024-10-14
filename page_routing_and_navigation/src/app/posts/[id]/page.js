import { promises as fs } from "fs";
import path from "path";

// This line is only necessary if this file isn't already in a server component location
// use server

export default async function PostPage({ params }) {
  console.log("Received params:", params);

  if (!params || !params.id) {
    console.error("Error: Post ID is missing.");
    return <div>Error: Post ID is missing.</div>;
  }

  const postFilePath = path.join(
    process.cwd(),
    "src",
    "app",
    "posts",
    params.id,
    "post.json"
  );

  console.log(`Attempting to read file from path: ${postFilePath}`);

  let post;
  try {
    const fileContents = await fs.readFile(postFilePath, "utf8");
    post = JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file from path: ${postFilePath}`, error);
    return <div>Error loading post.</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

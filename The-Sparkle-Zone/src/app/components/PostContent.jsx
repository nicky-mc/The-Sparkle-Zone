"use client";

import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

const PostContent = ({ post }) => {
  const router = useRouter();

  const handleDeletePost = async () => {
    const response = await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/Blog");
    } else {
      console.error("Error deleting post");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold font-raleway mb-2 text-black dark:text-white">
        {post.title}
      </h1>
      <p className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
        Author: {post.author}
      </p>
      <div className="content text-black dark:text-white">
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
      <button
        onClick={handleDeletePost}
        className="text-red-500 hover:text-red-600 flex items-center mt-4"
      >
        <TrashIcon className="h-6 w-6 mr-2" /> Delete Post
      </button>
    </div>
  );
};

export default PostContent;

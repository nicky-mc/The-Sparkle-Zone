"use client"; // This component will run on the client side

import { useState, useEffect } from "react"; // For managing state and side effects
import { TrashIcon } from "@heroicons/react/24/outline"; // Importing only TrashIcon for now

const CommentsSection = ({ post }) => {
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [name, setName] = useState(""); // State for user name
  const [location, setLocation] = useState(""); // State for user location

  useEffect(() => {
    const fetchComments = async () => {
      if (!post?.id) return; // Ensure post.id is available
      try {
        const response = await fetch(`/api/posts/${post.id}/comments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data); // Set fetched comments in state
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments(); // Call the fetch function
  }, [post]); // Dependency on post

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !name.trim()) return; // Validate input
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          name,
          location,
        }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments((prev) => [...prev, { ...addedComment, likes: 0 }]); // Initialize likes to 0
        setNewComment(""); // Clear input
        setName(""); // Clear name input
        setLocation(""); // Clear location input
      } else {
        const errorData = await response.json();
        console.error("Error adding comment:", errorData.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle liking a comment
  const handleLikeComment = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST", // Use POST method to like a comment
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === updatedComment.id // Adjust this if your API response structure differs
              ? { ...comment, likes: updatedComment.likes } // Update likes from the server response
              : comment
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Error liking comment:", errorData.message);
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <div className="comments-section p-4 rounded-lg bg-white">
      <h2 className="text-2xl mb-4 text-black">Comments</h2>

      {/* Comment input form */}
      <div className="mb-6 p-4 bg-gray-200 rounded-lg">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state
          className="border p-2 mb-2 w-full border-gray-400 text-black"
        />
        <input
          type="text"
          placeholder="Your Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)} // Update location state
          className="border p-2 mb-2 w-full border-gray-400 text-black"
        />
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)} // Update comment state
          className="border p-2 mb-2 w-full border-gray-400 text-black"
        ></textarea>
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Comment
        </button>
      </div>

      {/* Render existing comments */}
      <ul className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li
              key={comment.id}
              className="p-4 rounded-lg bg-gray-100 text-black"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold">{comment.name}</p>
                <div className="flex items-center">
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="mr-2"
                  >
                    Like {/* Simple text for the like button */}
                  </button>
                  <span>{comment.likes || 0}</span> {/* Display likes */}
                  <button onClick={() => handleDeleteComment(comment.id)}>
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              {comment.location && (
                <p className="text-sm text-gray-500">{comment.location}</p>
              )}
              <p className="mt-2">{comment.content}</p>
            </li>
          ))
        ) : (
          <p className="text-black">
            No comments yet. Be the first to comment!
          </p>
        )}
      </ul>
    </div>
  );
};

export default CommentsSection; // Export the component
"use client"; // This component will run on the client side

import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/outline"; // Importing only TrashIcon for now

const CommentsSection = ({ post }) => {
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [name, setName] = useState(""); // State for user name
  const [location, setLocation] = useState(""); // State for user location
  const [isEditing, setIsEditing] = useState(null); // State to track the comment being edited
  const [editContent, setEditContent] = useState(""); // State for edited comment content

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

  // Handle editing a comment
  const handleEditComment = (comment) => {
    setIsEditing(comment.id); // Set the comment ID being edited
    setEditContent(comment.content); // Pre-fill the textarea with the existing comment content
  };

  // Submit the edited comment
  const handleEditSubmit = async (commentId) => {
    if (editContent.trim() === "") {
      alert("Comment content cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }), // Only send content to update
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === updatedComment.id ? updatedComment : comment
          )
        ); // Update comment in state
        setIsEditing(null); // Exit editing mode after successful update
        setEditContent(""); // Clear the editContent state
      } else {
        console.error("Failed to update comment.");
      }
    } catch (error) {
      console.error("Error while updating the comment:", error);
    }
  };

  // Cancel the edit process
  const handleCancelEdit = () => {
    setIsEditing(null); // Exit editing mode without saving changes
    setEditContent(""); // Clear the editContent state
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId)); // Remove deleted comment from state
      } else {
        const errorData = await response.json();
        console.error("Error deleting comment:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle liking a comment
  const handleLikeComment = async (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (!comment) return;

    const newLikes = (comment.likes || 0) + 1; // Increment likes count

    try {
      const response = await fetch(`/api/posts/${post.id}/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: newLikes }), // Send updated likes
      });

      if (response.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, likes: newLikes } : c))
        ); // Update likes in state
      } else {
        console.error("Failed to update likes.");
      }
    } catch (error) {
      console.error("Error while updating likes:", error);
    }
  };

  return (
    <div className="comments-section">
      <div className="mb-4">
        {/* Input fields for adding a new comment */}
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state
          className="border p-2 mb-2 w-full border-gray-400 text-black"
        />
        <input
          type="text"
          placeholder="Your location"
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
              {isEditing === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => handleEditSubmit(comment.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-500 text-white px-4 py-2 rounded ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{comment.name}</p>
                    {comment.location && (
                      <p className="text-sm text-gray-500">{comment.location}</p>
                    )}
                    <p className="mt-2">{comment.content}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className="mr-2"
                    >
                      Like {/* Simple text for the like button */}
                    </button>
                    <span>{comment.likes || 0}</span> {/* Display likes */}
                    <button onClick={() => handleEditComment(comment)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <p className="text-black">No comments yet. Be the first to comment!</p>
        )}
      </ul>
    </div>
  );
};

export default CommentsSection;
import { queryDb } from "@/utils/dbconnection"; // PostgreSQL query function

// Handle GET requests to fetch comments associated with a specific post
export async function GET(req, { params }) {
  const { id } = params; // Extract postId from params

  try {
    // Fetch comments associated with the specific post using postId
    const commentsResult = await queryDb(
      "SELECT * FROM comments WHERE post_id = $1",
      [id] // Using postId to fetch comments
    );
    const comments = commentsResult.rows;

    // Return comments
    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching comments", error }),
      { status: 500 }
    );
  }
}

// Handle POST requests to create a new comment
export async function POST(req, { params }) {
  const { id } = params; // Extract postId from params
  const { content, name, location } = await req.json(); // Extract content, name, and location from request body

  // Step 1: Validate Input
  if (!content || !name) {
    return new Response(
      JSON.stringify({ message: "Content and name are required" }),
      { status: 400 }
    );
  }

  try {
    // Step 2: Insert Comment into Database
    const result = await queryDb(
      "INSERT INTO comments (post_id, content, name, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, content, name, location] // Use postId to associate the comment
    );

    const createdComment = result.rows[0];

    // Step 3: Return Success Response
    return new Response(JSON.stringify(createdComment), {
      status: 201, // Created
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return new Response(
      JSON.stringify({
        message: "Error creating comment",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Handle PUT requests to update comment content and/or likes
export async function PUT(req, { params }) {
  const { id } = params; // Extract postId from params
  const { commentId, content, likes } = await req.json(); // Extract commentId, content, and likes from request body

  if (!commentId) {
    return new Response(
      JSON.stringify({ message: "commentId is required" }),
      { status: 400 }
    );
  }

  try {
    // Update comment content and/or likes (both can be updated independently)
    const updateResult = await queryDb(
      "UPDATE comments SET content = COALESCE($1, content), likes = COALESCE($2, likes) WHERE id = $3 AND post_id = $4 RETURNING *",
      [content, likes, commentId, id]
    );

    const updatedComment = updateResult.rows[0];

    if (!updatedComment) {
      return new Response(
        JSON.stringify({ message: "Comment not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(updatedComment), { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error);
    return new Response(
      JSON.stringify({ message: "Error updating comment", error }),
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove a specific comment
export async function DELETE(req, { params }) {
  const { id } = params; // Extract postId from params
  const { commentId } = await req.json(); // Extract commentId from request body

  try {
    // Check if the comment exists
    const commentResult = await queryDb(
      "SELECT * FROM comments WHERE id = $1 AND post_id = $2",
      [commentId, id] // Ensure the comment belongs to the correct post
    );
    const comment = commentResult.rows[0];

    if (!comment) {
      return new Response(JSON.stringify({ message: "Comment not found" }), {
        status: 404,
      });
    }

    // Step 4: Delete the comment from the database
    await queryDb("DELETE FROM comments WHERE id = $1", [commentId]);

    // Step 5: Return success response
    return new Response(
      JSON.stringify({ message: "Comment deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting comment", error }),
      { status: 500 }
    );
  }
}

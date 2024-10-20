import { db } from "@/utils/dbconnection"; // Ensure db is properly imported
import { supabase } from "@/utils/supabaseClient"; // Ensure Supabase client is imported

export async function DELETE(req, { params }) {
  const { id } = params;

  // Step 1: Validate the ID
  if (!id) {
    return new Response(JSON.stringify({ message: "Post ID is required" }), {
      status: 400,
    });
  }

  try {
    // Step 2: Fetch the post's image_url (if needed)
    const postResult = await db.query(
      "SELECT image_url FROM posts WHERE id = $1",
      [id]
    );
    const post = postResult.rows[0];

    if (!post) {
      return new Response(JSON.stringify({ message: "Post not found" }), {
        status: 404,
      });
    }

    // Step 3: Extract the image filename from the image_url
    const imageFilename = post.image_url.split("/").pop(); // Get the last part of the URL

    // Step 4: Delete the image from Supabase 'image_for_url' bucket
    if (imageFilename) {
      const { error } = await supabase.storage
        .from("image_for_url")
        .remove([imageFilename]);
      if (error) {
        console.error("Error deleting file from bucket:", error);
        return new Response(
          JSON.stringify({ message: "Error deleting file from bucket" }),
          { status: 500 }
        );
      }
    }

    // Step 5: Delete the post from the database
    await db.query("DELETE FROM posts WHERE id = $1", [id]);

    // Step 6: Return success response
    return new Response(
      JSON.stringify({ message: "Post and image deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting post:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting post", error: error.message }),
      { status: 500 }
    );
  }
}
export async function POST(req, { params }) {
  const { commentId } = params;

  try {
    // Update the likes count in the comments table
    const result = await db.query(
      "UPDATE comments SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [commentId]
    );

    if (result.rowCount === 0) {
      return new Response(JSON.stringify({ message: "Comment not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Comment liked successfully", commentId }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error liking comment:", error);
    return new Response(
      JSON.stringify({ message: "Error liking comment", error: error.message }),
      { status: 500 }
    );
  }
}

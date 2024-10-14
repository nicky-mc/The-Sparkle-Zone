async function getComments(postId) {
  const res = await fetch(`/api/posts/${postId}/comments`);
  if (!res.ok) {
    throw new Error("Failed to fetch comments");
  }
  return res.json();
}

export default async function CommentPage({ params }) {
  const comments = await getComments(params.id);

  return (
    <div>
      <h1>
        Post Page ID: {params.id}, Comment ID: {params.commentId}
      </h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.text}</li>
        ))}
      </ul>
    </div>
  );
}

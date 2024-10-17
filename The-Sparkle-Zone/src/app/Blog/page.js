import { db } from "@/utils/dbconnection";
import "./blog.css";

export default async function blogPosts() {
  const posts = await db.query(`SELECT * FROM posts`);
  console.log(posts);
  const wrangledPosts = posts.rows;

  return (
    <div className="blog_container">
      {wrangledPosts.map((post) => (
        <div key={post.id} className="blog_item">
          <h2 className="title">{post.title}</h2>
          <h3 className="author">{post.author}</h3>
          <img src={post.image_url} alt="blog image" className="image" />
          <p className="content">{post.content}</p>
          <p className="date">{post.date}</p>
        </div>
      ))}
    </div>
  );
}

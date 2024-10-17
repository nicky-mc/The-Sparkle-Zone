//export default function newPost() {
//  return (
//    <div>
//      <h1>New Post</h1>
//      <form>
//        <label htmlFor="title">Title</label>
//        <input type="text" id="title" name="title" />
//        <label htmlFor="author">Author</label>
//        <input type="text" id="author" name="author" />
//        <label htmlFor="category">Category</label>
//        <input type="text" id="category" name="category" />
//        <label htmlFor="content">Content</label>
//        <textarea id="content" name="content" />
// upload image input here
//        <label htmlFor="image">Image</label>
//        <input type="file" id="image" name="image" />
//        <label type="submit">Submit</button>
//      </form>
//    </div>
//  );
//}
//we create the logic for the form submission and image upload in the next step on a new page.js file called newPost.js in the same directory.
//using this code snippet:
//import { supabase } from "@/utils/dbconnection";
//import { useState } from "react";
//import { useRouter } from "next/router";
//
//export default function NewPost() {
//  const [title, setTitle] = useState("");
//  const [author, setAuthor] = useState("");
//  const [category, setCategory] = useState("");
//  const [content, setContent] = useState("");
//  const [image, setImage] = useState(null);
//  const router = useRouter();
//
//  async function handleSubmit(event) {
//    event.preventDefault();
//
//    const formData = new FormData();
//    formData.append("title", title);
//    formData.append("author", author);
//    formData.append("category", category);
//    formData.append("content", content);
//    formData.append("image", image);
//  const { data, error } = await supabase.storage.from("images").upload(image.name, image);
//    if (error) {
//      console.error("Error uploading image:", error);
//      return;
//    }
//    const imageUrl = data.Key;
//    formData.append("image_url", imageUrl);
//
//    const response = await fetch("/api/posts", {
//      method: "POST",
//      body: formData,
//    });
//    if (response.ok) {
//      router.push("/Blog");
//    } else {
//      console.error("Error creating post");
//    }
//  }
// return (
//    <div>
//      <h1>New Post</h1>
//      <form onSubmit={handleSubmit}>
//        <label htmlFor="title">Title</label>
//        <input type="text" id="title" name="title" onChange={(event) => setTitle(event.target.value)} />
//        <label htmlFor="author">Author</label>
//        <input type="text" id="author" name="author" onChange={(event) => setAuthor(event.target.value)} />
//        <label htmlFor="category">Category</label>
//        <input type="text" id="category" name="category" onChange={(event) => setCategory(event.target.value)} />
//        <label htmlFor="content">Content</label>
//        <textarea id="content" name="content" onChange={(event) => setContent(event.target.value)} />
//        <label htmlFor="image">Image</label>
//        <input type="file" id="image" name="image" onChange={(event) => setImage(event.target.files[0])} />
//        <button type="submit">Submit</button>
//      </form>
//    </div>
//  );
//}
//we will also need to create a new file in the api directory called posts.js with the following code snippet:

import { db } from "@/utils/dbconnection";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabase.from("posts").select("*");
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "POST":
      try {
        const { title, content, image_url, author, category_id } = req.body;
        const { data, error } = await supabase
          .from("posts")
          .insert([{ title, content, image_url, author, category_id }]);
        if (error) throw error;
        res.status(201).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "PUT":
      try {
        const { id, title, content, image_url, author, category_id } = req.body;
        const { data, error } = await supabase
          .from("posts")
          .update({ title, content, image_url, author, category_id })
          .eq("id", id);
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        const { data, error } = await supabase
          .from("posts")
          .delete()
          .eq("id", id);
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

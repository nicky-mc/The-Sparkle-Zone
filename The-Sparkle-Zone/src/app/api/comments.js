import { db } from "@/utils/dbconnection";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { post_id } = req.query;
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", post_id)
          .order("created_at", { ascending: true });
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "POST":
      try {
        const { post_id, name, content, location } = req.body;
        const { data, error } = await supabase
          .from("comments")
          .insert([{ post_id, name, content, location }]);
        if (error) throw error;
        res.status(201).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "PUT":
      try {
        const { id, content } = req.body;
        const { data, error } = await supabase
          .from("comments")
          .update({ content })
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
          .from("comments")
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

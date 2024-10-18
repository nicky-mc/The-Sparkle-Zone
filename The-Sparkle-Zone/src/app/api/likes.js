import { db } from "@/utils/dbconnection";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { comment_id } = req.query;
        const { data, error } = await supabase
          .from("likes")
          .select("*")
          .eq("comment_id", comment_id);
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "POST":
      try {
        const { comment_id } = req.body;
        const { data, error } = await supabase
          .from("likes")
          .insert([{ comment_id }]);
        if (error) throw error;
        res.status(201).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    case "DELETE":
      try {
        const { id } = req.body;
        const { data, error } = await supabase
          .from("likes")
          .delete()
          .eq("id", id);
        if (error) throw error;
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

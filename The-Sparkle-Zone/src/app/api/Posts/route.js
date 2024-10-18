import { NextResponse } from "next/server";
import db from "@/utils/dbconnection";

export async function GET() {
  try {
    const { data, error } = await db.from("categories").select("id, name");
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const postData = await request.json();
    const { data, error } = await db.from("posts").insert([postData]).select();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

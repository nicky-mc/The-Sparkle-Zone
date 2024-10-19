import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    // Get the file from the request
    const formData = await req.formData();
    const file = formData.get("photo");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a path for saving the file
    const uploadPath = path.join(process.cwd(), "public", "uploads");

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Save the file to the uploads directory
    const filePath = path.join(uploadPath, `${Date.now()}-${file.name}`);
    const fileStream = fs.createWriteStream(filePath);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fileStream.write(fileBuffer);
    fileStream.end();

    const imageUrl = `/uploads/${path.basename(filePath)}`;

    // Respond with the file URL
    return NextResponse.json({ imageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}

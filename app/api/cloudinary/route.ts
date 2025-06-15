import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { file } = await request.json();

    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "flux",
    });

    return NextResponse.json(uploadResponse);
  } catch (error) {
    return NextResponse.json(error);
  }
}

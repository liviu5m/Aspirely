import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface Course {
  id: string;
  title: string;
  description?: string;
  url: string;
  kind: string;
  domain?: string;
}

export async function GET(request: NextRequest) {
  try {
    const response = await axios.get<Course[]>(
      "https://www.khanacademy.org/api/v1/topics",
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    const programmingCourses = response.data
      .filter(
        (topic): topic is Course =>
          topic.kind === "Topic" &&
          (topic.title.includes("Programming") ||
            topic.title.includes("Computer Science"))
      )
      .slice(0, 20);
    return NextResponse.json(programmingCourses);
  } catch (error) {
    return NextResponse.json(error);
  }
}

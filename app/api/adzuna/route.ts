import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { careerPath } = await request.json();

    const res = await axios.get(`https://api.adzuna.com/v1/api/jobs/gb/search/1`, {
      params: {
        app_id: process.env.ADZUNA_APP_ID,
        app_key: process.env.ADZUNA_APP_KEY,
        what: careerPath, 
        results_per_page: 20,
      },
    });

    return NextResponse.json(res.data);
  } catch (err) {
    return NextResponse.json(err);
  }
}

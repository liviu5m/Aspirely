import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define Zod schema
const RegisterSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    username: z.string().min(1, "Username is required."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input using Zod
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const errorMessages = parsed.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", details: errorMessages },
        { status: 400 }
      );
    }
    const { email, name, username, password } = parsed.data;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        password: await bcrypt.hash(password, 10),
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 403 });
  }
}

import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/newsletter";

/** POST { email } -> { status: "subscribed" | "duplicate" | "invalid" | "error" } */
export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  if (typeof email !== "string") {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const result = await subscribeToNewsletter(email);

  const statusCode =
    result.status === "invalid" ? 400 : result.status === "error" ? 502 : 200;

  return NextResponse.json(result, { status: statusCode });
}

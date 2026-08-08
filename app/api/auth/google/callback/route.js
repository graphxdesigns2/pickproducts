import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getPayload } from "payload";
import config from "@payload-config";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/auth/google/callback`
);

function generateRandomPassword() {
  return Math.random().toString(36).slice(-16) + Math.random().toString(36).slice(-16);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  try {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const profile = ticket.getPayload();
    const email = profile.email;
    const name = profile.name;

    const payloadCms = await getPayload({ config });
    const tempPassword = generateRandomPassword();

    const existing = await payloadCms.find({
      collection: "customers",
      where: { email: { equals: email } },
    });

    if (existing.docs.length > 0) {
      // Existing customer — reset their password to our known temp value so we can log in
      await payloadCms.update({
        collection: "customers",
        id: existing.docs[0].id,
        data: { password: tempPassword },
      });
    } else {
      // New customer — create with our known temp password
      await payloadCms.create({
        collection: "customers",
        data: { email, password: tempPassword, name },
      });
    }

    const loginResult = await payloadCms.login({
      collection: "customers",
      data: { email, password: tempPassword },
    });

    const response = NextResponse.redirect(new URL("/", request.url));
    if (loginResult.token) {
      response.cookies.set("payload-token", loginResult.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
  }
}
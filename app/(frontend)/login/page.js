"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCustomer } from "@/context/CustomerContext";

export default function LoginPage() {
  const { login, signup } = useCustomer();
  const router = useRouter();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

function handleGoogleSignIn() {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });
  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result =
      mode === "login"
        ? await login(email, password)
        : await signup(email, password, name);

    setSubmitting(false);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error);
    }
  }

return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div className="auth-hero-logo">PickMy<span>Products</span>.com</div>
          <h1>Trending finds, delivered to your door.</h1>
          <p>Join thousands of shoppers discovering curated products from trusted suppliers worldwide.</p>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-card">
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="auth-sub">
            {mode === "login"
              ? "Log in to continue to your account."
              : "Sign up to save your cart and track orders."}
          </p>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="auth-google-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">or</div>

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "signup" && (
              <div className="auth-field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jeanette Martinez"
                />
              </div>
            )}
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="auth-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" disabled={submitting} className="auth-submit">
              {submitting ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>
          <p className="auth-switch">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <span onClick={() => { setMode("signup"); setError(""); }}>Sign up</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => { setMode("login"); setError(""); }}>Log in</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
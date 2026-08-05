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
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

import { loginUser, getCurrentUser } from "../../api/authApi";
import { useAppDispatch } from "../../hooks/redux";
import { loginSuccess } from "../../auth/authSlice";

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const tokens = await loginUser({ email, password });

      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);

      const user = await getCurrentUser();

      localStorage.setItem("current_user", JSON.stringify(user));
      localStorage.setItem("user_role", user.role);

      dispatch(
        loginSuccess({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          user,
        })
      );

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-800">
          SaaS Ticketing Login
        </h1>

        <p className="mb-8 text-center text-slate-500">
          Sign in to continue.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border p-3"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-xl border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-slate-400"
        >
          <LogIn size={18} />
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mt-2 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}









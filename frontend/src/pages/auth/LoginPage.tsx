import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { loginUser, getCurrentUser } from "../../api/authApi";
import { loginSuccess } from "../../auth/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("saswatmohanty640@gmail.com");
  const [password, setPassword] = useState("Agent@123456");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await loginUser({ email, password });

      localStorage.setItem("access_token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);

      dispatch(
        loginSuccess({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        })
      );

      const user = await getCurrentUser();

      localStorage.setItem("user_role", user.role.toUpperCase());
      localStorage.setItem(
        "user_name",
        `${user.first_name} ${user.last_name}`
      );
      localStorage.setItem("user_email", user.email);
      localStorage.setItem("user_id", user.id);

      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-slate-800">Login</h1>

        <p className="mt-2 text-slate-500">
          SaaS Customer Ticketing System
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-100 p-3 text-red-600">
            {error}
          </p>
        )}

        <input
          className="mt-6 w-full rounded-xl border p-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl border p-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
          Login
        </button>

        <Link
          to="/forgot-password"
          className="mt-4 block text-center text-blue-600"
        >
          Forgot Password?
        </Link>
      </form>
    </div>
  );
}

import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api/client";
import { UserContext } from "../UserContext.jsx";
import { notify } from "../utils/notifications";
import Image from "../component/Image.jsx";

function normalizeEmail(value = "") {
  return value.trim().toLowerCase();
}

function isValidEmail(value = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const normalizedEmail = normalizeEmail(email);
    const errors = {};

    if (!normalizedEmail) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(normalizedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const message = Object.values(errors)[0];
      setErrorMessage(message);
      notify.warning(message);
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post("/api/login", {
        email: normalizedEmail,
        password,
      });
      setFieldErrors({});
      setUser(data.data);
      notify.success("Login successful");
      setRedirect(true);
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.error || "Login Failed";
      setErrorMessage(message);
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="grow bg-[#F7F7F7] px-3 py-6 sm:px-4 sm:py-12">
      <div className="mx-auto grid min-h-[34rem] max-w-6xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl shadow-black/10 ring-1 ring-black/5 sm:rounded-[2rem] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[34rem] overflow-hidden bg-[#222222] lg:block">
          <Image
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
            alt="Modern stay interior"
            loading="eager"
            className="absolute inset-0 h-full w-full rounded-none opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-[#222222]/35 to-transparent" />
          <div className="absolute bottom-0 p-10 text-white">
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">Premium stays, made simple</p>
            <h1 className="max-w-md text-5xl font-black leading-tight">Feel at home before you arrive.</h1>
            <p className="mt-4 max-w-sm text-base font-semibold text-white/80">Log in to manage bookings, saved homes, and hosting in one polished place.</p>
          </div>
        </section>
        <section className="flex min-w-0 items-center px-4 py-8 sm:px-10 sm:py-10">
          <div className="w-full">
        <h1 className="mb-2 text-center text-3xl font-black text-[#222222] sm:text-4xl">Login</h1>
        <p className="mb-8 text-center font-medium text-slate-500">Welcome back to StayFinder</p>
        {errorMessage && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
            {errorMessage}
          </div>
        )}
        <form
          className="w-full flex flex-col gap-5"
          onSubmit={handleLoginSubmit}
        >
          <label className="space-y-2">
            <span className="text-sm font-black text-[#222222]">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-[#F7F7F7] p-4 font-semibold text-[#222222] outline-none transition hover:border-slate-300 focus:border-[#FF385C] focus:bg-white focus:ring-4 focus:ring-[#FF385C]/15"
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          {fieldErrors.email && <p className="text-sm font-bold text-red-600">{fieldErrors.email}</p>}
          </label>
          <label className="space-y-2">
            <span className="text-sm font-black text-[#222222]">Password</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-[#F7F7F7] p-4 font-semibold text-[#222222] outline-none transition hover:border-slate-300 focus:border-[#FF385C] focus:bg-white focus:ring-4 focus:ring-[#FF385C]/15"
            type="password" required
            placeholder="Enter your password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          {fieldErrors.password && <p className="text-sm font-bold text-red-600">{fieldErrors.password}</p>}
          </label>
          <button
            disabled={isSubmitting}
            className="mt-3 rounded-2xl bg-[#FF385C] p-4 text-lg font-black text-white shadow-lg shadow-[#FF385C]/25 transition hover:-translate-y-0.5 hover:bg-[#e93051] hover:shadow-xl hover:shadow-[#FF385C]/25 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
          <div className="text-center py-2 font-medium text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link className="font-black text-[#FF385C] underline-offset-4 hover:underline" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;

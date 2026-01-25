import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import logo from "../../../assets/logo.png";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // navigate("/shop"); // Handled by App.jsx redirect
    },
    onError: () => {
      toast.error("Login failed. Please check your email and password.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111] border border-white/10 rounded-2xl shadow-xl overflow-hidden p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="mb-6 group">
            <img src={logo} alt="SwapIt" className="size-12 group-hover:scale-110 transition-transform duration-300" />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400 text-center">
            Sign in to continue swapping on campus.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all placeholder-zinc-500"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
              />
            </div>

            <div className="relative group">
              <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all placeholder-zinc-500"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "Logging in..." : "Login"}
          </button>

          {isError && <p className="text-red-400 text-sm text-center">{error.message}</p>}
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-zinc-400 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium hover:underline transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

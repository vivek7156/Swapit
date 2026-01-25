import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SearchableDropdown from "../../../components/SearchableDropdown";
import logo from "../../../assets/logo.png";
import { motion } from "framer-motion";

function SignUpPage() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    collegeId: "",
  });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`/api/colleges`);
        const data = await response.json();
        setColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, username, password, collegeId }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, password, collegeId }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "An error occurred while signing up");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
    },
  });

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college);
    setFormData((prev) => ({
      ...prev,
      collegeId: college ? college._id : "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4 py-10">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] -z-10" />

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
          <h1 className="text-3xl font-bold text-white mb-2">Join SwapIt</h1>
          <p className="text-zinc-400 text-center">
            Create an account to start buying and selling.
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Username */}
            <div className="relative group">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all placeholder-zinc-500"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <MdOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all placeholder-zinc-500"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <MdPassword className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-zinc-900 border border-white/5 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all placeholder-zinc-500"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
            </div>

            {/* College Selection */}
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2 pl-1">Select Your College</label>
              <SearchableDropdown
                colleges={colleges}
                value={selectedCollege}
                onChange={handleCollegeSelect}
                placeholder="Search for your college..."
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </button>

          {isError && <p className="text-red-400 text-sm text-center">{error.message}</p>}
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-zinc-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUpPage;

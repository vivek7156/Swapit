import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
      navigate("/shop");
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col sm:w-[25rem] w-[17rem]" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <label className="input input-bordered rounded flex items-center gap-2 bg-zinc-800 text-white px-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow bg-transparent border-none focus:ring-0 h-10"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2 bg-zinc-800 text-white px-2">
            <MdPassword />
            <input
              type="password"
              className="grow bg-transparent border-none focus:ring-0 h-10"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button className="btn rounded-xl btn-primary text-white bg-green-500 hover:bg-green-600 h-10">Login</button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col gap-2 mt-4 sm:w-[25rem] w-[17rem]">
          <p className="text-white text-lg">{"Don't"} have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-xl btn-primary text-white btn-outline w-full hover:bg-green-600 hover:text-black h-10 border border-1 border-white">Sign up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

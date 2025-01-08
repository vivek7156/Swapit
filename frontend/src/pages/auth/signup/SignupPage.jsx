import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function SignUpPage() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
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

  const { mutate, isError, error } = useMutation({
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
      toast.success("User signed up successfully");
    },
  });

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college.name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      collegeId: college._id,
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
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="sm:w-[25rem] w-[17rem] mx-auto flex gap-4 flex-col" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>
          <label className="input input-bordered rounded flex items-center gap-2 bg-zinc-800 text-white px-2">
            <FaUser />
            <input
              type="text"
              className="grow bg-transparent border-none focus:ring-0 h-10"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
          <label className="input input-bordered rounded flex items-center gap-2 bg-zinc-800 text-white px-2">
            <MdOutlineMail />
            <input
              type="email"
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
          <label htmlFor="college" className="w-full font-medium text-lg text-white">Select Your College</label>
          <details className="dropdown w-full dropdown-top">
            <summary className="btn m-1 w-full bg-zinc-800 rounded-xl text-white h-10">
              {selectedCollege || "Select College"}
            </summary>
            <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow text-lg">
              {colleges.map((college) => (
                <li key={college._id}>
                  <a onClick={() => handleCollegeSelect(college)} role="button" className="text-white">
                    {college.name}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <button type="submit" className="btn rounded-xl btn-primary text-white bg-green-500 hover:bg-green-600 h-10">Sign up</button>
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        <div className="flex flex-col sm:w-[25rem] w-[17rem] gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-xl btn-primary text-white btn-outline w-full hover:bg-green-600 hover:text-black h-10 border border-1 border-white">Sign in</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;

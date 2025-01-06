import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";



function SignUpPage(){
    const [colleges, setColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState("");
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
  
    // Initial form data state
    const [formData, setFormData] = useState({
      email: "",
      username: "",
      password: "",
      collegeId: "",
    });

    const { mutate, isError, isPending, error } =  useMutation({
      mutationFn: async({email, username, password, collegeId}) => {
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
            throw new Error("An error occurred while signing up" || data.error);
          }
          if(data.error){
            throw new Error(data.error);
          }
          console.log(data);
          return data;
        } catch (error) {
          console.error("Error signing up:", error);
          throw error;
        }
      },
      onSuccess: () => {
        toast.success("User signed up successfully");
      }
    });

    const handleCollegeSelect = (college) => {
        setSelectedCollege(college.name);
        setFormData((prevFormData) => ({
            ...prevFormData,
            collegeId: college._id, // Set collegeId with the selected college's _id
        }));
    };  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      mutate(formData);
    };
  
    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='sm:w-[25rem] w-[17rem] mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>                    
                    <div className='flex gap-4 flex-wrap w-full'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1 w-full'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                    </div>
                    <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>
                    <label htmlFor="college" className='w-full font-medium text-lg'>Select Your College</label>
                    <details className="dropdown w-full dropdown-top">
                        <summary className="btn m-1 w-full bg-zinc-800 rounded-xl">
                            {selectedCollege || "Select College"}
                        </summary>
                        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow text-lg">
                            {colleges.map((college) => (
                                <li key={college._id}>
                                    <a onClick={() => handleCollegeSelect(college)} role="button">
                                        {college.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </details>


					<button type="submit" className='btn rounded-xl btn-primary text-white text-lg'>Sign up</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col sm:w-[25rem] w-[17rem] gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-xl btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;
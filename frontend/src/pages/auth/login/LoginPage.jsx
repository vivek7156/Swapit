import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
	const queryClient = useQueryClient();

	const { mutate:loginMutation, isPending, isError, error } = useMutation({
		mutationFn: async ({email, password}) => {
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
				throw new Error(error);
				
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["authUser"]});
		},
	});

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginMutation(formData);
        // try {
        //     const response = await fetch("http://localhost:5000/api/auth/login", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(formData),
        //     });

        //     if (response.ok) {
        //         const data = await response.json();
        //         console.log("User logged in:", data);
        //         localStorage.setItem("user", JSON.stringify(response));

        //         // Redirect to dashboard or home page after login
        //         navigate("/dashboard"); // Adjust path as needed
        //     } else {
        //         const errorData = await response.json();
        //         console.error("Login error:", errorData.message);
        //         alert("Login failed. Please check your username and password.");
        //     }
        // } catch (error) {
        //     console.error("Error logging in:", error);
        // }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 flex flex-col justify-center items-center bg-black'>
				<form className='flex gap-4 flex-col sm:w-[25rem] w-[17rem]' onSubmit={handleSubmit}>
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
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
					<button className='btn rounded-xl btn-primary text-white'>Login</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4 sm:w-[25rem] w-[17rem]'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-xl btn-primary text-white btn-outline sm:w-[25rem] w-[17rem]'>Sign up</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;

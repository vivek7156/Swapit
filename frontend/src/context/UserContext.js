// import React, { createContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export const UserContext = createContext();

// const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const navigate = useNavigate();

//     // Check if user data is already saved (e.g., in localStorage) and set user on load
//     useEffect(() => {
//         const storedUser = JSON.parse(localStorage.getItem('user'));
//         if (storedUser) setUser(storedUser);
//     }, []);

//     // Login function to save user info and redirect
//     const login = (userData) => {
//         setUser(userData);
//         localStorage.setItem('user', JSON.stringify(userData));
//         navigate('/dashboard'); // Redirect to dashboard on login
//     };

//     // Logout function to clear user info
//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('user');
//         navigate('/login'); // Redirect to login on logout
//     };

//     return (
//         <UserContext.Provider value={{ user, login, logout }}>
//             {children}
//         </UserContext.Provider>
//     );
// };

// export default UserProvider;

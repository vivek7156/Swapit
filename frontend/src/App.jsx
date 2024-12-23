import { useNavigate, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignupPage";
import DashboardPage from "./pages/dashboard/Dashboard";
import SearchPage from "./pages/dashboard/SearchPage";
import MessagingPage from "./pages/dashboard/Message";
import UserListingsPage from "./pages/dashboard/YourListings";
import UserProfile from "./pages/dashboard/UserProfile";
import NotificationsPage from "./pages/dashboard/NotificationPage";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/LoadingSpinner";
import { LocateFixed } from "lucide-react";

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Shop");
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
  };

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/myprofile');
        const data = await res.json();
        if(data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("data", data);
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  });

  // // Redirect to login if authUser is not available
  // useEffect(() => {
  //   if (!authUser && !isLoading) {
  //     navigate('/login');
  //   }
  // }, [authUser, isLoading, navigate]);

  if(isLoading){
    return(
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="">
      {authUser && <Navbar toggleSidebar={toggleSidebar} />}
            
      {/* Sidebar Component */}
      {authUser && location.pathname !== '/' && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
        />
      )}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/shop" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/shop" />} />
        <Route path='/shop' element={authUser ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path='/search' element={authUser ? <SearchPage /> : <Navigate to="/login" />} />
        <Route path='/messages' element={authUser ? <MessagingPage /> : <Navigate to="/login" />} />
        <Route path='/listings' element={authUser ? <UserListingsPage /> : <Navigate to="/login" />} />
        <Route path='/profile/:username' element={authUser ? <UserProfile /> : <Navigate to="/login" />} />
        <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
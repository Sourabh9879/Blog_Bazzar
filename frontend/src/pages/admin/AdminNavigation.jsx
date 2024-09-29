import React from 'react';
import AdminImg from "../../assets/admin.png";
import { NavLink, useNavigate } from 'react-router-dom';
import { useLogoutUserMutation } from '../../redux/features/auth/authApi';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/auth/authSlice';  // Ensure logout action is imported

function AdminNavigation() {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();  // Use navigate for redirection

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();  // Log out from backend
            dispatch(logout());  // Clear user data from Redux store
            
            // Clear cookies or tokens if you're using them
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.removeItem('user');  // Clear localStorage

            navigate('/login');  // Redirect to login page after logout
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <div className='space-y-5 bg-white p-8 md:h-[calc(100vh-98px)] flex flex-col justify-between'>
            <div>
                {/* Header part */}
                <div className='mb-5'>
                    <img src={AdminImg} alt="Admin" className='size-14' />
                    <p className='font-semibold'>Admin</p>
                </div>
                <hr />
                <ul className='space-y-5 pt-5'>
                    <li>
                        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-black"}>Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/add-new-post" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-black"}>Add New Blog</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/manage-items" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-black"}>Manage Blogs</NavLink>
                    </li>
                    <li>
                        <NavLink to="/dashboard/users" className={({ isActive }) => isActive ? "text-blue-600 font-bold" : "text-black"}>Users</NavLink>
                    </li>
                </ul>
            </div>

            <div className='mb-3'>
                <hr className='mb-3' />
                <button
                    onClick={handleLogout}
                    className='text-white bg-red-500 font-medium px-5 py-1 rounded'
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AdminNavigation;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation, useSendOtpMutation , useVerifyOtpMutation} from '../../redux/features/auth/authApi';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // State for OTP
    const [otpSent, setOtpSent] = useState(false); // Track if OTP was sent
    const [message, setMessage] = useState('');
    const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();
    const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation(); // Use sendOtp mutation
    const [verifyOtp, { isLoading: verifyLoading }] = useVerifyOtpMutation(); // Use verifyOtp mutation

    const navigate = useNavigate();

    // Function to handle sending OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await sendOtp(email).unwrap(); // Using unwrap to get the response directly
            setOtpSent(true);
            alert('OTP sent to your email');
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage(error.data.message || 'Error sending OTP');
        }
    };

    // Function to verify OTP and register user
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const data = {
            username,
            email,
            password,
            otp
        };

        try {
            await verifyOtp(data).unwrap(); // Use verifyOtp mutation to verify the OTP
            alert("Registration Successful");
            navigate('/login');
        } catch (error) {
            console.error('OTP verification error:', error);
            setMessage(error.data.message || 'Failed to verify OTP');
        }
    };

    return (
        <div className='max-w-sm bg-white mx-auto p-8 mt-36'>
            <h2 className='text-2xl font-semibold pt-5'>Please Register</h2>
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className='space-y-5 max-w-sm mx-auto pt-8'>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder='Username' 
                    required 
                    className='w-full bg-bgPrimary focus:outline-none px-5 py-3' 
                />
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder='Email' 
                    required 
                    className='w-full bg-bgPrimary focus:outline-none px-5 py-3' 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder='Password' 
                    required 
                    className='w-full bg-bgPrimary focus:outline-none px-5 py-3' 
                />
                
                {otpSent && (
                    <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        placeholder='Enter OTP' 
                        required 
                        className='w-full bg-bgPrimary focus:outline-none px-5 py-3'
                    />
                )}
                {message && <p className='text-red-500'>{message}</p>}
                <button 
                    type="submit" 
                    disabled={registerLoading} 
                    className='w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'>
                    {otpSent ? 'Verify OTP' : 'Register'}
                </button>
            </form>
            <p className='my-5 text-center'>Already have an account? Please <Link to="/login" className='text-red-700 italic'>Login</Link></p>
        </div>
    )
}

export default Register;

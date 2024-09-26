import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../../redux/features/auth/authApi'

function Register() {

    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [message, setMessage] = React.useState('')
    const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        const data = {
            username,
            email,
            password
        };

        try {
            const response = await registerUser(data).unwrap();
            console.log(response);
            const { user } = response;
            // localStorage.setItem('user', JSON.stringify(user));
            alert("Registration Successful");
            navigate('/login'); 
        } catch (error) {
            setMessage("Failed to register, please try again.");
            console.error('Registration error:', error);
        }
    };

    return (
        <div className='max-w-sm bg-white mx-auto p-8 mt-36'>
            <h2 className='text-2xl font-semibold pt-5'>Please Register</h2>
            <form onSubmit={handleRegister} className='space-y-5 max-w-sm mx-auto pt-8'>
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
                {message && <p className='text-red-500'>{message}</p>}
                <button 
                    type="submit" 
                    disabled={registerLoading} 
                    className='w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'>
                    Register
                </button>
            </form>
            <p className='my-5 text-center'>Already have an account? Please <Link to="/login" className='text-red-700 italic'>Login</Link></p>
        </div>
    )
}

export default Register;

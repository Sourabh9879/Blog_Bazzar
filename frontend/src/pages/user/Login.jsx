import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginUserMutation } from '../../redux/features/auth/authApi';
import { setUser } from '../../redux/features/auth/authSlice';  // Import the setUser action

function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();
  
  const dispatch = useDispatch();  // Initialize dispatch
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const data = {
      email,
      password
    };

    try {
      const response = await loginUser(data).unwrap();
      console.log(response);
      const { token, user } = response;
      
      // Add the user details to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Dispatch setUser to update the Redux store with the logged-in user
      dispatch(setUser({ user }));

      alert('Login Successful');
      navigate('/');
    } catch (error) {
      setMessage('Please provide a valid email and password');
    }
  };

  return (
    <div className="max-w-sm bg-white mx-auto p-8 mt-36">
      <h2 className="text-2xl font-semibold pt-5">Please Login</h2>
      <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto pt-8">
        <input
          type="email"
          value={email}
          placeholder="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-bgPrimary focus:outline-none px-5 py-3"
        />
        <input
          type="password"
          value={password}
          placeholder="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-bgPrimary focus:outline-none px-5 py-3"
        />
        {message && <p className="text-red-500">{message}</p>}
        <button
          disabled={loginLoading}
          className="w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md"
        >
          Login
        </button>
      </form>
      <p className="my-5 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-red-700 italic">
          Register
        </Link>{' '}
        here
      </p>
    </div>
  );
}

export default Login;

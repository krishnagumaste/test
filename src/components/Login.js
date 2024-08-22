import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ip from './ip';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // State to hold the error message

    const handleClick = async (e) => {
        e.preventDefault(); // Prevent the default form submission
    
        try {
            const response = await axios.post(ip + '/login', {
                email: email,
                password: password,
            });
    
            if (response.status === 200) {
                const token = response.data.token; // Assuming the token is in the response data
                localStorage.setItem('token', token); // Store the token in local storage
                navigate('/landing'); // Navigate to the landing page
            } else {
                setError('Login failed');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Invalid email or password'); // Set the error message from the server response
            } else {
                console.error('An error occurred during login:', error);
                setError('An unexpected error occurred. Please try again later.');
            }
        }
    };

    return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}
  
              <div>
                <button
                  type="submit"
                  onClick={handleClick}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <button onClick={() => navigate("/signup")} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign Up
            </button>
          </p>
          </div>
        </div>
      </>
    )
}

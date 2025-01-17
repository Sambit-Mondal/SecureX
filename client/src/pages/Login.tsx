import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    accountType: '',
    email: '',
    uniqueCode: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!formData.accountType || !formData.email || !formData.password || !formData.uniqueCode) {
      toast.error('All fields are required.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/api/auth/login`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', formData.accountType);

      if (formData.accountType === 'buyer') {
        localStorage.setItem('buyerID', formData.uniqueCode);
      } else if (formData.accountType === 'vendor') {
        localStorage.setItem('vendorID', formData.uniqueCode);
      }

      let userRole = '';
      try {
        const decodedToken: { accountType: string } = JSON.parse(
          atob(token.split('.')[1])
        );
        userRole = decodedToken.accountType;
      } catch (err) {
        console.error('Invalid token format:', err);
        toast.error('Invalid token. Please try logging in again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }

      toast.success('Login successful! Redirecting...', {
        position: 'top-right',
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate(userRole === 'buyer' ? '/buyer/products' : '/vendor/products');
      }, 3000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || 'Login failed. Please check your credentials.',
        { position: 'top-right', autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-[60%] h-[28rem] p-4 bg-neutral-300 rounded-md border-neutral-500 border-2 shadow-xl drop-shadow-xl shadow-neutral-500 flex flex-col items-center justify-between">
        <div className="w-full flex items-center justify-center flex-col text-lg font-bold gap-2">
          Login
          <hr className="w-full h-[1px] border-none bg-neutral-500" />
        </div>
        <div className="w-full overflow-hidden overflow-y-auto h-[18rem] p-3 border-2 border-black rounded-md flex items-center justify-start pb-4 gap-3 flex-col">
          <div className="flex items-start justify-center flex-col w-full gap-1">
            <label className="text-black font-semibold text-sm">Account Type</label>
            <select
              name="accountType"
              className="w-full bg-transparent px-2 text-sm border-2 border-neutral-500 rounded-md py-1 focus:outline-none"
              value={formData.accountType}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Account Type
              </option>
              <option value="buyer">Buyer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          <div className="flex items-start justify-center flex-col w-full gap-1">
            <label className="text-black font-semibold text-sm">Email</label>
            <input
              type="email"
              name="email"
              className="w-full bg-transparent px-2 text-sm border-2 border-neutral-500 rounded-md py-1 focus:outline-none"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-start justify-center flex-col w-full gap-1">
            <label className="text-black font-semibold text-sm">Unique Code</label>
            <input
              type="text"
              name="uniqueCode"
              className="w-full bg-transparent px-2 text-sm border-2 border-neutral-500 rounded-md py-1 focus:outline-none"
              value={formData.uniqueCode}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex items-start justify-center flex-col w-full gap-1">
            <label className="text-black font-semibold text-sm">Password</label>
            <div className="w-full border-2 border-neutral-500 rounded-md py-1 flex items-center justify-center pr-2">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                name="password"
                className="w-full bg-transparent px-2 text-sm focus:outline-none"
                value={formData.password}
                onChange={handleInputChange}
              />
              {isPasswordVisible ? (
                <EyeIcon className="size-5 text-black cursor-pointer" onClick={togglePasswordVisibility} />
              ) : (
                <EyeSlashIcon className="size-5 text-black cursor-pointer" onClick={togglePasswordVisibility} />
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-neutral-400 text-black font-semibold rounded-md transition-colors ease-in-out duration-200 hover:bg-neutral-500 hover:text-white"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="w-full text-sm text-center gap-2 flex items-center justify-center">
          New to SecureComm?
          <Link to="/signup" className="text-blue-500 font-semibold underline transition duration-200 ease-in-out hover:scale-110">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
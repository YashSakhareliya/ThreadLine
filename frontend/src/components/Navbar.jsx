import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, role, loading } = useSelector((state) => state.auth);
  
  console.log(user);

  if(loading){
    return <div>Loading...</div>
  }
  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Scissors className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">SuitCraft</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/fabrics" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Fabrics</Link>
              <Link to="/tailors" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Tailors</Link>
              <Link to="/about" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
              <Link to="/contact" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Contact Us</Link>
            </div>
          </div>
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-900">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Logout</button>
              </div>
            ) : (
              <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">Login / Sign Up</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

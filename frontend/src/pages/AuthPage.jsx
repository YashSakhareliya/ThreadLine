import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Scissors,
  Store,
  Mail,
  Lock,
  MapPin,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cities } from "../data/mockData";
import ForgotPassword from "../components/auth/ForgotPassword";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    city: "",
    phone: "",
    bio: "",
    specialization: [],
  });

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roles = [
    {
      id: "customer",
      name: "Customer",
      icon: User,
      color: "from-customer-primary to-customer-secondary",
    },
    {
      id: "tailor",
      name: "Tailor",
      icon: Scissors,
      color: "from-tailor-primary to-tailor-secondary",
    },
    {
      id: "shop",
      name: "Fabric Shop",
      icon: Store,
      color: "from-shop-primary to-shop-secondary",
    },
  ];

  const handleInputChange = (e) => {
    // console.log(formData);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let user;
      if (isLogin) {
        user = await login(formData.email, formData.password, selectedRole);
      } else {
        // console.log('Registering user with data:', { ...formData, role: selectedRole });
        user = await register({ ...formData, role: selectedRole });
      }

      const from =
        location.state?.from?.pathname || getDashboardPath(user.role);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case "customer":
        return "/shops";
      case "tailor":
        return "/tailor/dashboard";
      case "shop":
        return "/shop/dashboard";
      default:
        return "/";
    }
  };

  const getRoleColor = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.color : "from-customer-primary to-customer-secondary";
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-slate-800">
            {isLogin ? "Welcome Back" : "Join ThreadLine"}
          </h2>
          <p className="mt-2 text-slate-600">
            {isLogin
              ? "Sign in to your account"
              : "Create your account to get started"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 shadow-xl"
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <motion.button
                  key={role.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setError("");
                  }}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                    selectedRole === role.id
                      ? `bg-gradient-to-r ${role.color} text-white border-transparent`
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <role.icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs font-semibold">{role.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
             
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        required={!isLogin}
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <select
                        name="city"
                        required={!isLogin}
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field pl-10 appearance-none"
                      >
                        <option value="">Select your city</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        required={!isLogin}
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${getRoleColor(
                selectedRole
              )} shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-slate-600 hover:text-customer-primary transition-colors duration-300"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="font-semibold">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;

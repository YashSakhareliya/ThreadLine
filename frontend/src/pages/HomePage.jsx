import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Scissors, 
  Shield, 
  Star,
  ArrowRight,
  Users,
  Store,
  Truck
} from 'lucide-react';
import SearchBar from '../components/common/SearchBar';

const HomePage = () => {
  const features = [
    {
      icon: MapPin,
      title: "City-Based Search",
      description: "Find shops and tailors in your city with precise location-based results"
    },
    {
      icon: ShoppingBag,
      title: "Online Fabric Shopping",
      description: "Browse and purchase premium fabrics from verified shops across India"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Safe and secure transactions with Razorpay integration"
    },
    {
      icon: Scissors,
      title: "Expert Tailors",
      description: "Connect with skilled tailors and view their portfolios and pricing"
    }
  ];

  const stats = [
    { number: "500+", label: "Fabric Shops", icon: Store },
    { number: "1000+", label: "Expert Tailors", icon: Scissors },
    { number: "50+", label: "Cities Covered", icon: MapPin },
    { number: "10K+", label: "Happy Customers", icon: Users }
  ];

  const handleSearch = ({ query, city }) => {
    console.log('Search:', { query, city });
    // Navigate to search results
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-customer-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-customer-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold"
              >
                <span className="bg-gradient-to-r from-customer-primary via-customer-secondary to-tailor-primary bg-clip-text text-transparent">
                  ThreadLine
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
              >
               Connect with the best fabric shops and tailors in your city. 
                Quality fabrics, skilled craftsmanship, find the nearest to you.
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search shops & tailors by city..."
              />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/shops"
                className="group flex items-center space-x-2 btn-primary text-lg px-8 py-4"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                to="/tailors"
                className="group flex items-center space-x-2 btn-secondary text-lg px-8 py-4"
              >
                <Scissors className="w-5 h-5" />
                <span>Explore Tailors</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Why Choose ThreadLine?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We connect you with verified fabric shops and skilled tailors across India, 
              making quality craftsmanship accessible to everyone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-customer-primary to-customer-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-customer-primary to-customer-secondary rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-semibold">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-gradient-to-r from-customer-primary to-customer-secondary text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust ThreadLine for their fabric and tailoring needs.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center space-x-2 bg-white text-customer-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-colors duration-300"
            >
              <span>Join ThreadLine Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
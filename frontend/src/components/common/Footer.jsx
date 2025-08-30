import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Scissors, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-white/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-customer-primary to-customer-secondary rounded-lg flex items-center justify-center"
              >
                <Scissors className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-customer-primary to-customer-secondary bg-clip-text text-transparent">
                ThreadLine
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              Connecting customers with the best fabric shops and tailors across India. 
              Quality fabrics, skilled craftsmanship, delivered to your doorstep.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-600 hover:text-customer-primary transition-colors duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Quick Links</h3>
            <div className="space-y-2">
              {[
                { name: 'All Shops', path: '/shops' },
                { name: 'Find Tailors', path: '/tailors' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-slate-600 hover:text-customer-primary transition-colors duration-300 text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Services</h3>
            <div className="space-y-2">
              {[
                'Fabric Shopping',
                'Custom Tailoring',
                'City-wise Search',
                'Secure Payments',
                'Order Tracking',
                'Quality Assurance'
              ].map((service) => (
                <p key={service} className="text-slate-600 text-sm">
                  {service}
                </p>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-customer-primary" />
                <span className="text-slate-600 text-sm">support@threadline.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-customer-primary" />
                <span className="text-slate-600 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-customer-primary" />
                <span className="text-slate-600 text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-sm">
            © 2024 ThreadLine. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-slate-600 hover:text-customer-primary text-sm transition-colors duration-300">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-slate-600 hover:text-customer-primary text-sm transition-colors duration-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
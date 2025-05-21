import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Search, Package } from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Cotton',
      image: "https://images.clericitessuto.it/w:auto/h:auto/q:90/f:best/https://shop.newtess.com/comceptw/img/suiting-fabrics-img-8281.jpg",
      slug: 'cotton'
    },
    {
      name: 'Silk',
      image:"https://cdn.shopify.com/s/files/1/0250/8557/5222/files/Fine-Natural-Stretch-Wool-VOMANO-Fabric-fabricsight-Meters-Shuttle-Grey_480x480.jpg?v=1642513746",
      slug: 'silk'
    },
    {
      name: 'Linen',
      image: "https://cdn.shopify.com/s/files/1/0250/8557/5222/files/Worsted-Wool-Blend-for-Suits-ALENTO-Navy-Fabric-fabricsight-Meters-Charade-Navy-4-3_480x480.jpg?v=1642514063",
      slug: 'linen'
    },
    {
      name: 'Velvet',
      image: "https://cdn.shopify.com/s/files/1/0250/8557/5222/files/Premium-Pure-Wool-Suiting-Twill-MAVONE-Fabric-fabricsight-Meters-Nero_27f44ba8-ca40-4e66-aac8-16c8bc02a4c9_480x480.jpg?v=1642514134",
      slug: 'velvet'
    }
  ];

  const testimonials = [
    {
      name: 'jenish',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      text: 'Found my perfect suit fabric and an amazing tailor through SuitCraft. The process was seamless!',
      rating: 5
    },
    {
      name: 'Aaryan',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      text: 'The quality of both the fabric and tailoring exceeded my expectations. Highly recommended!',
      rating: 5
    },
    {
      name: 'kavan',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      text: 'Great platform for finding unique fabrics and skilled tailors. Will definitely use again!',
      rating: 4
    }
  ];

  return (
    <div className="pt-16 ">
      {/* Hero Section */}
      <section
        className="relative h-[600px] bg-cover bg-center "
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1543132220-3ec99c6094dc)'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-4">Craft Your Perfect Suit</h1>
            <p className="text-xl mb-8">Connect with premium fabric sellers and expert tailors</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/fabrics')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
              >
                Explore Fabrics
              </button>
              <button
                onClick={() => navigate('/tailors')}
                className="bg-white text-gray-900 px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
              >
                Find Tailors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Fabric Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.slug} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Search className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Browse Fabrics</h3>
              <p className="text-gray-600">Explore our curated collection of premium fabrics</p>
            </div>
            <div className="text-center">
              <Scissors className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect with Tailors</h3>
              <p className="text-gray-600">Find expert tailors near you</p>
            </div>
            <div className="text-center">
              <Package className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Get Your Custom Suit</h3>
              <p className="text-gray-600">Receive your perfectly tailored suit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-white/90 mb-8">Join SuitCraft today and experience the perfect fit</p>
          <button
            onClick={() => navigate('/signup')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
          >
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;

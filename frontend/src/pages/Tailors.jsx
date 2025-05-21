import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Star, MapPin, Filter } from "lucide-react";
import TailorCard from "../components/TailorCard";

const Tailors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // Dummy data for tailors
  const tailors = [
    {
      id: "1",
      name: "jenish",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      rating: 5,
      specialty: "Wedding Suits",
      location: "vadodara",
      price: 200,
      reviews: 124,
    },
    {
      id: "2",
      name: "aaryan",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      rating: 4.8,
      specialty: "Business Wear",
      location: "surat",
      price: 180,
      reviews: 98,
    },
    {
      id: "3",
      name: "kavan",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      rating: 4.9,
      specialty: "Ethnic Wear",
      location: "vadodara",
      price: 220,
      reviews: 156,
    },
    {
      id: "4",
      name: "dikal",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      rating: 4.7,
      specialty: "Wedding Suits",
      location: "surat",
      price: 190,
      reviews: 87,
    },
  ];

  const specialties = [
    "Wedding Suits",
    "Business Wear",
    "Ethnic Wear",
    "Formal Wear",
  ];
  const ratings = ["5", "4+", "3+"];

  const filteredTailors = tailors
    .filter(
      (tailor) =>
        tailor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tailor.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (tailor) =>
        selectedSpecialty === "all" || tailor.specialty === selectedSpecialty
    )
    .filter((tailor) => {
      if (selectedRating === "all") return true;
      if (selectedRating === "5") return tailor.rating === 5;
      if (selectedRating === "4+") return tailor.rating >= 4;
      if (selectedRating === "3+") return tailor.rating >= 3;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1556905055-8f358a7a47b2)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Skilled Tailors for Your Perfect Suit
          </h1>
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white shadow-lg"
              />
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="mr-2" size={20} />
                Filters
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="all">All Specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="all">All Ratings</option>
                    {ratings.map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Stars
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tailors Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTailors.map((tailor) => (
                <TailorCard
                  key={tailor.id}
                  {...tailor}
                  onViewProfile={() => navigate(`/tailors/${tailor.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Are you a tailor?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our platform and connect with customers looking for quality
            tailoring services
          </p>
          <button
            onClick={() => navigate("/tailors/register")}
            className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
          >
            Join SuitCraft Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Tailors;

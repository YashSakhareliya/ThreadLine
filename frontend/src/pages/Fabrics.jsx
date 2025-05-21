import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Star } from "lucide-react";
import FabricCard from "../components/FabricCard";

const Fabrics = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  // Dummy data for fabrics
  const fabrics = [
    {
      id: "1",
      name: "Premium Italian Cotton",
      image: "https://images.clericitessuto.it/w:auto/h:auto/q:90/f:best/https://shop.newtess.com/comceptw/img/suiting-fabrics-img-8281.jpg",
      price: 45,
      rating: 4.8,
      type: "Cotton",
      color: "White",
      reviews: 156,
      stock: true,
    },
    {
      id: "2",
      name: "Pure Mulberry Silk",
      image: "https://cdn.shopify.com/s/files/1/0250/8557/5222/files/Fine-Natural-Stretch-Wool-VOMANO-Fabric-fabricsight-Meters-Shuttle-Grey_480x480.jpg?v=1642513746",
      price: 95,
      rating: 5.0,
      type: "Silk",
      color: "Navy Blue",
      reviews: 89,
      stock: true,
    },
    {
      id: "3",
      name: "Irish Linen",
      image: "https://cdn.shopify.com/s/files/1/0250/8557/5222/files/Worsted-Wool-Blend-for-Suits-ALENTO-Navy-Fabric-fabricsight-Meters-Charade-Navy-4-3_480x480.jpg?v=1642514063",
      price: 65,
      rating: 4.7,
      type: "Linen",
      color: "Beige",
      reviews: 124,
      stock: true,
    },
    {
      id: "4",
      name: "Royal Velvet",
      image: "https://cdn.shopify.com/s/files/1/0250/8557/5222/files/Premium-Pure-Wool-Suiting-Twill-MAVONE-Fabric-fabricsight-Meters-Nero_27f44ba8-ca40-4e66-aac8-16c8bc02a4c9_480x480.jpg?v=1642514134",
      price: 85,
      rating: 4.9,
      type: "Velvet",
      color: "Burgundy",
      reviews: 78,
      stock: false,
    },
  ];

  const fabricTypes = ["Cotton", "Silk", "Linen", "Velvet"];
  const priceRanges = ["0-50", "51-100", "101+"];

  const filteredFabrics = fabrics
    .filter(
      (fabric) =>
        fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fabric.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((fabric) => selectedType === "all" || fabric.type === selectedType)
    .filter((fabric) => {
      if (selectedPriceRange === "all") return true;
      const [min, max] = selectedPriceRange.split("-").map(Number);
      if (!max) return fabric.price >= min;
      return fabric.price >= min && fabric.price <= max;
    })
    .sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviews - a.reviews; // popularity
    });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        className="relative h-[400px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Browse the Finest Fabrics for Your Perfect Suit
          </h1>
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search fabrics by name or type..."
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
                    Fabric Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    {fabricTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range ($/meter)
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="all">All Prices</option>
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        ${range === "101+" ? "101 and above" : range}
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
                    <option value="popularity">Most Popular</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Fabrics Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFabrics.map((fabric) => (
                <FabricCard
                  key={fabric.id}
                  {...fabric}
                  onViewDetails={() => navigate(`/fabrics/${fabric.id}`)}
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
            Are you a fabric seller?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            List your premium fabric collection on SuitCraft and reach thousands
            of customers
          </p>
          <button
            onClick={() => navigate("/seller/register")}
            className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100"
          >
            Start Selling Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Fabrics;

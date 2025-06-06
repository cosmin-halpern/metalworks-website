import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Product } from "@/types";
import QuoteFormDialog from "@/features/QuoteFormDialog.tsx";
import Button from "../components/ui/button";
import Banner from "../components/Banner";

const products: Product[] = Array.from({ length: 9 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product Model ${i + 1}`,
  description: "High-quality metal shelving unit for industrial & retail use.",
  image: `https://placehold.co/400x300/eeeeee/333333?text=Prod+${i + 1}`,
  category: "Shelving",
  specifications: {
    "Weight Capacity": "500kg",
    "Dimensions": "120x60x180cm",
    "Material": "Steel",
  },
}));

const categories = ['All', 'Storage', 'Workshop', 'Safety', 'Tools'];

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openQuoteForm, setOpenQuoteForm] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleQuoteClick = (productName: string): void => {
    setSelectedProduct(productName);
    setOpenQuoteForm(true);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return (a.specifications?.WeightCapacity || '').localeCompare(b.specifications?.WeightCapacity || '');
      case 'price-desc':
        return (b.specifications?.WeightCapacity || '').localeCompare(a.specifications?.WeightCapacity || '');
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Banner
        title="Our Products"
        subtitle="Discover our range of high-quality metal fabrication products"
        backgroundImage="/images/banners/products-banner.jpg"
        height="h-64"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-background-dark rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/50 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-text/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary bg-background"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-text/20 rounded-lg hover:bg-background"
                >
                  <Filter className="h-5 w-5" />
                  Filter
                  <ChevronDown className={`h-5 w-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isFilterOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-background-dark rounded-lg shadow-lg py-2 z-10"
                    >
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 hover:bg-background ${
                            selectedCategory === category ? 'text-secondary bg-secondary/10' : 'text-text'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-text/20 rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary bg-background"
              >
                <option value="name">Sort by Name</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="bg-background-dark rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-primary">{product.name}</h3>
                  <span className="text-lg font-bold text-secondary">${product.specifications?.["Weight Capacity"] ?? ''}</span>
                </div>
                <p className="text-text mb-4">{product.description}</p>
                <div className="space-y-2">
                  {Object.entries(product.specifications ?? {}).map(([key, value]) => (
                    <div key={key} className="flex items-center text-sm text-text/70">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full bg-secondary text-white py-2 rounded-lg hover:bg-secondary-dark transition-colors duration-200"
                  onClick={() => handleQuoteClick(product.name)}
                >
                  Request Quote
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <QuoteFormDialog
        open={openQuoteForm}
        setOpen={setOpenQuoteForm}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage; 
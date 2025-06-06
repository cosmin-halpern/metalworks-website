import React from "react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  onQuoteClick: (name: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, onQuoteClick }) => {
  const product = {
    id,
    name: `Shelf Model ${id}`,
    description: "Heavy-duty metal shelving unit suitable for industrial storage or retail displays.",
    image: `/shelf-${id}.jpg`,
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-slate-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm"
          onClick={() => onQuoteClick(product.name)}
        >
          Request Quote
        </Button>
      </div>
    </div>
  );
};

export default ProductCard; 
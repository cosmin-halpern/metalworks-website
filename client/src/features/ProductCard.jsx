import React from "react";
import { Card, CardContent } from "client/src/components/ui/card.jsx";
import { Button } from "client/src/components/ui/button.jsx";


const imageUrls = [
    "https://images.unsplash.com/photo-1616627981381-4b8f23f47875?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1601979031925-2e8a1e2e4c2b?auto=format&fit=crop&w=600&q=80"
];

export default function ProductCard({ id, onQuoteClick }) {
    return (
        <Card className="rounded-2xl shadow-lg hover:shadow-xl transition">
            <CardContent className="p-4">
                <img
                    src={imageUrls[id - 1]}
                    alt={`Shelf ${id}`}
                    className="rounded-md mb-4 w-full h-48 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">Shelf Model {id}</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Heavy-duty metal shelving unit suitable for industrial storage or retail displays.
                </p>
                <Button className="w-full" onClick={() => onQuoteClick(`Shelf Model ${id}`)}>
                    Request Quote
                </Button>
            </CardContent>
        </Card>
    );
}

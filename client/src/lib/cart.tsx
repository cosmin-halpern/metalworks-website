import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
    productId: string;
    title: string;
    price: number;
    imageUrl: string;
    quantity: number;
};

type CartContextValue = {
    items: CartItem[];
    itemCount: number;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    increase: (productId: string) => void;
    decrease: (productId: string) => void;
    removeItem: (productId: string) => void;
    clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'corsican_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setItems(JSON.parse(raw));
        } catch {
            setItems([]);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // ignore
        }
    }, [items]);

    const addItem: CartContextValue['addItem'] = (item) => {
        setItems((prev) => {
            const existing = prev.find((p) => p.productId === item.productId);
            if (!existing) return [...prev, { ...item, quantity: 1 }];

            return prev.map((p) =>
                p.productId === item.productId ? { ...p, quantity: p.quantity + 1 } : p
            );
        });
    };

    const increase: CartContextValue['increase'] = (productId) => {
        setItems((prev) =>
            prev.map((p) => (p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p))
        );
    };

    const decrease: CartContextValue['decrease'] = (productId) => {
        setItems((prev) => {
            const found = prev.find((p) => p.productId === productId);
            if (!found) return prev;

            if (found.quantity <= 1) return prev.filter((p) => p.productId !== productId);

            return prev.map((p) =>
                p.productId === productId ? { ...p, quantity: p.quantity - 1 } : p
            );
        });
    };

    const removeItem: CartContextValue['removeItem'] = (productId) => {
        setItems((prev) => prev.filter((p) => p.productId !== productId));
    };

    const clear: CartContextValue['clear'] = () => setItems([]);

    const itemCount = useMemo(() => {
        return items.reduce((sum, it) => sum + (it.quantity || 0), 0);
    }, [items]);

    const value = useMemo<CartContextValue>(() => {
        return { items, itemCount, addItem, increase, decrease, removeItem, clear };
    }, [items, itemCount]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};
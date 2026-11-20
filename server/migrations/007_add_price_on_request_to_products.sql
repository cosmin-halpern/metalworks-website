-- Migration 007: products can show "Cere ofertă" instead of a price
ALTER TABLE products
    ADD COLUMN price_on_request TINYINT(1) NOT NULL DEFAULT 0 AFTER price;

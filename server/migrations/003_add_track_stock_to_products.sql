-- Migration 003: Add track_stock and stock columns to products table
ALTER TABLE products
    ADD COLUMN track_stock TINYINT(1) NOT NULL DEFAULT 0 AFTER active,
    ADD COLUMN stock       INT        NOT NULL DEFAULT 0 AFTER track_stock;

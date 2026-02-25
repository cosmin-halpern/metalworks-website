-- Migration 002: Add payment_status and netopia_ntf_url columns to orders
ALTER TABLE orders
    ADD COLUMN payment_status ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending'
        AFTER payment_method,
    ADD COLUMN netopia_ntf_url VARCHAR(1024) NOT NULL DEFAULT ''
        AFTER payment_status;

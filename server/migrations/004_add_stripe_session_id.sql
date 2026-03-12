-- Migration 004: Add stripe_session_id column for Stripe Checkout integration
ALTER TABLE orders
    ADD COLUMN stripe_session_id VARCHAR(255) NOT NULL DEFAULT ''
        AFTER netopia_ntf_url;
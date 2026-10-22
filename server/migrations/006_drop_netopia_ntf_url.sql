-- Migration 006: Drop netopia_ntf_url — unused since the switch from Netopia to Stripe
ALTER TABLE orders
    DROP COLUMN netopia_ntf_url;

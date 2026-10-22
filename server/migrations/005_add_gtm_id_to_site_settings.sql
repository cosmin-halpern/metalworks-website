-- Migration 005: Google Tag Manager container ID, set from the admin panel (Setări Site)
ALTER TABLE site_settings
    ADD COLUMN gtm_id VARCHAR(20) NOT NULL DEFAULT '' AFTER logo_url;

-- Migration 008: extra images and PDF attachments for store products
-- (products.image_url stays the main image shown on the store card)
CREATE TABLE IF NOT EXISTS product_media (
    id         BIGINT UNSIGNED       NOT NULL AUTO_INCREMENT,
    product_id BIGINT UNSIGNED       NOT NULL,
    type       ENUM('image','file')  NOT NULL,
    src        VARCHAR(1024)         NOT NULL,
    name       VARCHAR(255)          NOT NULL DEFAULT '',
    sort_order INT                   NOT NULL DEFAULT 0,
    created_at TIMESTAMP             NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_product_media_product (product_id, sort_order),
    CONSTRAINT fk_product_media_product
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

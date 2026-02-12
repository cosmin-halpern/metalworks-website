-- Admins table (already migrated)
CREATE TABLE IF NOT EXISTS admins (
                                      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','editor') NOT NULL DEFAULT 'editor',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );



CREATE TABLE IF NOT EXISTS products (
                                        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                        title VARCHAR(255) NOT NULL,
                                        description TEXT NOT NULL,
                                        price DECIMAL(10,2) NOT NULL DEFAULT 0,
                                        image_url VARCHAR(1024) NOT NULL,
                                        active TINYINT(1) NOT NULL DEFAULT 1,
                                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                                        PRIMARY KEY (id),
                                        INDEX idx_products_active_created (active, created_at)
);


CREATE TABLE IF NOT EXISTS client_logos (
                                            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                            name VARCHAR(255) NOT NULL,
                                            src VARCHAR(1024) NOT NULL,
                                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                            PRIMARY KEY (id),
                                            INDEX idx_client_logos_created (created_at)
);

-- ... existing code ...

CREATE TABLE IF NOT EXISTS projects (
                                        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                        title VARCHAR(255) NOT NULL,
                                        description TEXT NOT NULL,
                                        cover_image VARCHAR(1024) NOT NULL,
                                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                                        PRIMARY KEY (id),
                                        INDEX idx_projects_created (created_at)
);

CREATE TABLE IF NOT EXISTS project_media (
                                             id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                             project_id BIGINT UNSIGNED NOT NULL,
                                             type ENUM('image','video') NOT NULL,
                                             src VARCHAR(1024) NOT NULL,
                                             sort_order INT NOT NULL DEFAULT 0,
                                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                             PRIMARY KEY (id),
                                             INDEX idx_project_media_project (project_id),
                                             CONSTRAINT fk_project_media_project
                                                 FOREIGN KEY (project_id) REFERENCES projects(id)
                                                     ON DELETE CASCADE
);

ALTER TABLE products
    ADD COLUMN track_stock TINYINT(1) NOT NULL DEFAULT 0;

ALTER TABLE products
    ADD COLUMN stock INT NOT NULL DEFAULT 0;

-- ... existing code ...

CREATE TABLE IF NOT EXISTS orders (
                                      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                      order_number VARCHAR(64) NOT NULL,
                                      status ENUM('new','processing','shipped','completed','cancelled') NOT NULL DEFAULT 'new',
                                      payment_method ENUM('cash','bank','card') NOT NULL,

                                      total DECIMAL(10,2) NOT NULL DEFAULT 0,

                                      shipping_full_name VARCHAR(255) NOT NULL,
                                      shipping_phone VARCHAR(64) NOT NULL,
                                      shipping_email VARCHAR(255) NOT NULL,
                                      shipping_address VARCHAR(1024) NOT NULL,
                                      shipping_city VARCHAR(255) NOT NULL,

                                      invoice_need_invoice TINYINT(1) NOT NULL DEFAULT 0,
                                      invoice_company_name VARCHAR(255) NOT NULL DEFAULT '',
                                      invoice_cui VARCHAR(64) NOT NULL DEFAULT '',
                                      invoice_company_address VARCHAR(1024) NOT NULL DEFAULT '',

                                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

                                      PRIMARY KEY (id),
                                      UNIQUE KEY uk_orders_order_number (order_number),
                                      INDEX idx_orders_status_created (status, created_at)
);

CREATE TABLE IF NOT EXISTS order_items (
                                           id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                                           order_id BIGINT UNSIGNED NOT NULL,
                                           product_id BIGINT UNSIGNED NOT NULL,
                                           title VARCHAR(255) NOT NULL,
                                           price DECIMAL(10,2) NOT NULL,
                                           quantity INT NOT NULL,
                                           image_url VARCHAR(1024) NOT NULL DEFAULT '',
                                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                           PRIMARY KEY (id),
                                           INDEX idx_order_items_order (order_id),
                                           CONSTRAINT fk_order_items_order
                                               FOREIGN KEY (order_id) REFERENCES orders(id)
                                                   ON DELETE CASCADE
);

-- ... existing code ...

CREATE TABLE IF NOT EXISTS site_settings (
                                             id TINYINT UNSIGNED NOT NULL,
                                             logo_url VARCHAR(1024) NOT NULL DEFAULT '',
                                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
                                             PRIMARY KEY (id)
);


INSERT INTO site_settings (id, logo_url)
VALUES (1, '')
ON DUPLICATE KEY UPDATE id = id;
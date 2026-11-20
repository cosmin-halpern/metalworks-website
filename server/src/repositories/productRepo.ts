import { pool } from '../db/mysql.js';

export type ProductRow = {
    id: number;
    title: string;
    description: string;
    price: string; // DECIMAL comes as string with mysql2
    price_on_request: number; // 0/1
    image_url: string;
    active: number; // 0/1
    created_at: string;
    updated_at: string | null;
};

export type ProductImage = { id: number; src: string };
export type ProductAttachment = { id: number; src: string; name: string };

export type ProductDTO = {
    id: number;
    title: string;
    description: string;
    price: number;
    priceOnRequest: boolean; // shown as "Cere ofertă" instead of the price, not sold online
    imageUrl: string;
    /** Extra images, after the main imageUrl */
    images: ProductImage[];
    /** PDF files (data sheets, drawings) */
    attachments: ProductAttachment[];
    active: boolean;
    createdAt: string;
    updatedAt: string | null;
};

type ProductMediaRow = {
    id: number;
    product_id: number;
    type: 'image' | 'file';
    src: string;
    name: string;
};

function toDTO(row: ProductRow, media: ProductMediaRow[] = []): ProductDTO {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        price: Number(row.price),
        priceOnRequest: Boolean(row.price_on_request),
        imageUrl: row.image_url,
        images: media.filter((m) => m.type === 'image').map((m) => ({ id: m.id, src: m.src })),
        attachments: media
            .filter((m) => m.type === 'file')
            .map((m) => ({ id: m.id, src: m.src, name: m.name })),
        active: Boolean(row.active),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

// One query for the media of all listed products
async function withMedia(rows: ProductRow[]): Promise<ProductDTO[]> {
    if (rows.length === 0) return [];
    const [mediaRows] = await pool.query(
        `SELECT id, product_id, type, src, name
         FROM product_media
         WHERE product_id IN (?)
         ORDER BY sort_order ASC, id ASC`,
        [rows.map((r) => r.id)]
    );
    const byProduct = new Map<number, ProductMediaRow[]>();
    for (const m of mediaRows as ProductMediaRow[]) {
        const list = byProduct.get(Number(m.product_id)) ?? [];
        list.push(m);
        byProduct.set(Number(m.product_id), list);
    }
    return rows.map((r) => toDTO(r, byProduct.get(Number(r.id))));
}

export async function listActiveProducts(): Promise<ProductDTO[]> {
    const [rows] = await pool.query(
        `SELECT id, title, description, price, price_on_request, image_url, active, created_at, updated_at
         FROM products
         WHERE active = 1
         ORDER BY created_at DESC
         LIMIT 100`
    );
    return withMedia(rows as ProductRow[]);
}

// Admin list: inactive products too, so they can be edited and switched back on
export async function listAllProducts(): Promise<ProductDTO[]> {
    const [rows] = await pool.query(
        `SELECT id, title, description, price, price_on_request, image_url, active, created_at, updated_at
         FROM products
         ORDER BY created_at DESC`
    );
    return withMedia(rows as ProductRow[]);
}

export async function findActiveProductByTitle(title: string): Promise<ProductDTO | null> {
    const [rows] = await pool.query(
        `SELECT id, title, description, price, price_on_request, image_url, active, created_at, updated_at
         FROM products
         WHERE active = 1 AND title = ?
         LIMIT 1`,
        [title]
    );
    const row = (rows as ProductRow[])[0];
    return row ? (await withMedia([row]))[0] : null;
}

export async function getProductById(id: number): Promise<ProductDTO | null> {
    const [rows] = await pool.query(
        `
    SELECT id, title, description, price, price_on_request, image_url, active, created_at, updated_at
    FROM products
    WHERE id = ?
    LIMIT 1
    `,
        [id]
    );
    const row = (rows as ProductRow[])[0];
    return row ? (await withMedia([row]))[0] : null;
}

export async function createProduct(input: {
    title: string;
    description: string;
    price: number;
    priceOnRequest: boolean;
    imageUrl: string;
    active: boolean;
}): Promise<ProductDTO> {
    const [result] = await pool.query(
        `
    INSERT INTO products (title, description, price, price_on_request, image_url, active)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
        [input.title, input.description, input.price, input.priceOnRequest ? 1 : 0, input.imageUrl, input.active ? 1 : 0]
    );

    const id = (result as any).insertId as number;
    const created = await getProductById(id);
    if (!created) throw new Error('Failed to load created product');
    return created;
}

export async function updateProduct(
    id: number,
    input: Partial<{
        title: string;
        description: string;
        price: number;
        priceOnRequest: boolean;
        imageUrl: string;
        active: boolean;
    }>
): Promise<ProductDTO | null> {
    const existing = await getProductById(id);
    if (!existing) return null;

    const next = {
        title: input.title ?? existing.title,
        description: input.description ?? existing.description,
        price: typeof input.price === 'number' ? input.price : existing.price,
        priceOnRequest: typeof input.priceOnRequest === 'boolean' ? input.priceOnRequest : existing.priceOnRequest,
        imageUrl: input.imageUrl ?? existing.imageUrl,
        active: typeof input.active === 'boolean' ? input.active : existing.active,
    };

    await pool.query(
        `
    UPDATE products
    SET title = ?, description = ?, price = ?, price_on_request = ?, image_url = ?, active = ?
    WHERE id = ?
    `,
        [next.title, next.description, next.price, next.priceOnRequest ? 1 : 0, next.imageUrl, next.active ? 1 : 0, id]
    );

    return await getProductById(id);
}

export async function deleteProductById(id: number): Promise<ProductDTO | null> {
    const existing = await getProductById(id);
    if (!existing) return null;

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return existing;
}

export type NewProductMedia = { type: 'image' | 'file'; src: string; name?: string };

// Appends after the product's current last item
export async function addProductMedia(productId: number, media: NewProductMedia[]): Promise<void> {
    if (media.length === 0) return;
    const [rows] = await pool.query(
        'SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM product_media WHERE product_id = ?',
        [productId]
    );
    const start = Number((rows as { maxOrder: number }[])[0]?.maxOrder ?? -1) + 1;
    await pool.query('INSERT INTO product_media (product_id, type, src, name, sort_order) VALUES ?', [
        media.map((m, i) => [productId, m.type, m.src, m.name ?? '', start + i]),
    ]);
}

export async function deleteProductMedia(
    mediaId: number,
    productId: number
): Promise<{ src: string } | null> {
    const [rows] = await pool.query('SELECT src FROM product_media WHERE id = ? AND product_id = ? LIMIT 1', [
        mediaId,
        productId,
    ]);
    const row = (rows as { src: string }[])[0];
    if (!row) return null;
    await pool.query('DELETE FROM product_media WHERE id = ?', [mediaId]);
    return row;
}

import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

async function seed() {
  await dataSource.initialize();

  const categoryNames = [
    'Electronics',
    'Accessories',
    'Clothing',
  ];

  const categoryIds = new Map<string, number>();

  for (const name of categoryNames) {
    const rows = await dataSource.query(
      `INSERT INTO categories (name)
       VALUES ($1)
       ON CONFLICT (name)
       DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name],
    );

    categoryIds.set(name, rows[0].id);
  }

  const products = [
    {
      name: 'iPhone 16',
      price: 999,
      stock: 50,
      category: 'Electronics',
    },
    {
      name: 'Galaxy S24',
      price: 849,
      stock: 40,
      category: 'Electronics',
    },
    {
      name: 'MacBook Pro',
      price: 2499,
      stock: 15,
      category: 'Electronics',
    },
    {
      name: 'iPad Air',
      price: 599,
      stock: 30,
      category: 'Electronics',
    },
    {
      name: 'AirPods Pro',
      price: 249,
      stock: 100,
      category: 'Accessories',
    },
    {
      name: 'USB-C Cable',
      price: 19,
      stock: 500,
      category: 'Accessories',
    },
    {
      name: 'MagSafe Charger',
      price: 39,
      stock: 80,
      category: 'Accessories',
    },
    {
      name: 'Laptop Sleeve',
      price: 49,
      stock: 60,
      category: 'Accessories',
    },
    {
      name: 'T-Shirt Dev',
      price: 25,
      stock: 200,
      category: 'Clothing',
    },
    {
      name: 'Hoodie NestJS',
      price: 55,
      stock: 75,
      category: 'Clothing',
    },
  ];

  for (let i = 0; i < 3; i++) {
    for (const product of products) {
      const suffix = i > 0 ? ` v${i + 1}` : '';
      const name = `${product.name}${suffix}`;
      const categoryId = categoryIds.get(product.category);

      await dataSource.query(
        `INSERT INTO products
          (name, price, stock, category_id)
         SELECT $1::varchar, $2, $3, $4
         WHERE NOT EXISTS (
           SELECT 1 FROM products WHERE name = $1::varchar
         )`,
        [
          name,
          product.price + i * 10,
          product.stock,
          categoryId,
        ],
      );
    }
  }

  console.log(
    'Seed complete: 3 categories, 30 products',
  );

  await dataSource.destroy();
}

seed().catch(async (error) => {
  console.error(error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});
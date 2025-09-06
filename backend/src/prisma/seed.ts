import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  // Create sample items
  const items = [
    {
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced camera and long battery life',
      price: 799.99,
      category: 'electronics',
      image: 'https://via.placeholder.com/300',
      stock: 50,
    },
    {
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals and gamers',
      price: 1299.99,
      category: 'electronics',
      image: 'https://via.placeholder.com/300',
      stock: 30,
    },
    {
      name: 'Wireless Headphones',
      description: 'Noise-cancelling wireless headphones with premium sound quality',
      price: 199.99,
      category: 'electronics',
      image: 'https://via.placeholder.com/300',
      stock: 100,
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracker and smartwatch with health monitoring features',
      price: 249.99,
      category: 'electronics',
      image: 'https://via.placeholder.com/300',
      stock: 75,
    },
    {
      name: 'Cotton T-Shirt',
      description: 'Comfortable cotton t-shirt available in multiple colors',
      price: 19.99,
      category: 'clothing',
      image: 'https://via.placeholder.com/300',
      stock: 200,
    },
    {
      name: 'Denim Jeans',
      description: 'Classic denim jeans with modern fit',
      price: 49.99,
      category: 'clothing',
      image: 'https://via.placeholder.com/300',
      stock: 150,
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes with cushioned soles',
      price: 89.99,
      category: 'footwear',
      image: 'https://via.placeholder.com/300',
      stock: 80,
    },
    {
      name: 'Backpack',
      description: 'Durable backpack with multiple compartments',
      price: 59.99,
      category: 'accessories',
      image: 'https://via.placeholder.com/300',
      stock: 120,
    },
    {
      name: 'Coffee Maker',
      description: 'Programmable coffee maker with thermal carafe',
      price: 79.99,
      category: 'home',
      image: 'https://via.placeholder.com/300',
      stock: 40,
    },
    {
      name: 'Blender',
      description: 'High-speed blender for smoothies and food preparation',
      price: 69.99,
      category: 'home',
      image: 'https://via.placeholder.com/300',
      stock: 60,
    },
    {
      name: 'Yoga Mat',
      description: 'Non-slip yoga mat for home workouts',
      price: 29.99,
      category: 'fitness',
      image: 'https://via.placeholder.com/300',
      stock: 100,
    },
    {
      name: 'Dumbbells Set',
      description: 'Adjustable dumbbells set for home gym',
      price: 149.99,
      category: 'fitness',
      image: 'https://via.placeholder.com/300',
      stock: 35,
    },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: item,
    });
  }

  console.log(`Database seeded with ${items.length} items`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
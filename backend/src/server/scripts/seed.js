import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { connectDB } from '../../server/config/db.js'
import { User } from '../../server/models/User.js'
import { Product } from '../../server/models/Product.js'
import slugify from 'slugify'

async function run() {
  await connectDB()
  console.log('Seeding HavenCraft...')

  // ensure admin
  const adminEmail = 'admin@havencraft.local'
  let admin = await User.findOne({ email: adminEmail })
  if (!admin) {
    admin = await User.create({ name: 'Admin', email: adminEmail, password: 'Admin@123', role: 'admin' })
    console.log('Created admin:', adminEmail, 'password: Admin@123')
  } else {
    console.log('Admin exists:', adminEmail)
  }

  const catalog = [
    {
      name: 'Asgaard sofa',
      description:
        'A modern, comfy sofa with solid teak frame and plush cushions. Designed to match the HavenCraft aesthetic.',
      price: 250000,
      category: 'Sofas',
      tags: ['Home', 'Shop', 'Sofa'],
      stock: 12,
      colors: ['beige', 'gray', 'blue'],
      images: [{ url: 'https://images.unsplash.com/photo-1582582429410-99c6c2' }, { url: 'https://images.unsplash.com/photo-1540575467063-7c6ca39bcc98' }],
      featured: true
    },
    {
      name: 'Side table',
      description: 'Minimal side table with a clean silhouette to complement living spaces.',
      price: 25000,
      category: 'Tables',
      tags: ['Home', 'Shop', 'Table'],
      stock: 30,
      images: [{ url: 'https://images.unsplash.com/photo-1616627459837-4c799' }],
      featured: true
    },
    {
      name: 'Granite dining table',
      description: 'Elegant granite top dining table paired with wooden legs.',
      price: 225000,
      category: 'Tables',
      tags: ['Dining', 'Table'],
      stock: 8,
      images: [{ url: 'https://images.unsplash.com/photo-1487017159836-4e23cec3df55' }]
    },
    {
      name: 'Outdoor bar table and stool',
      description: 'Outdoor-ready set for modern balconies and patios.',
      price: 25000,
      category: 'Outdoor',
      tags: ['Outdoor'],
      stock: 20,
      images: [{ url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4' }]
    }
  ]

  for (const item of catalog) {
    const exists = await Product.findOne({ name: item.name })
    if (exists) {
      console.log('Product exists:', item.name)
      continue
    }
    await Product.create({ ...item, slug: slugify(item.name, { lower: true }) })
    console.log('Added product:', item.name)
  }

  await mongoose.connection.close()
  console.log('Done.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.DB_URL
  if (!uri) {
    throw new Error('DB_URL is not set')
  }
  mongoose.set('strictQuery', true)
  await mongoose.connect(uri, {
    autoIndex: true
  })
  console.log('MongoDB connected')
}


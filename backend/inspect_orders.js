import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/server/models/Order.js';
import { User } from './src/server/models/User.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connect successfully');
    } catch (error) {
        console.error('MongoDB connect fail', error);
        process.exit(1);
    }
};

const inspectOrders = async () => {
    await connectDB();

    console.log("Fetching orders...");
    const orders = await Order.find({}).lean();
    console.log(`Found ${orders.length} orders.`);

    console.log("Fetching all users...");
    const users = await User.find({}).lean();
    const userIds = new Set(users.map(u => u._id.toString()));
    console.log(`Found ${users.length} users.`);

    let orphanCount = 0;

    for (const order of orders) {
        const userVal = order.user;
        const userIdStr = userVal ? userVal.toString() : 'null';

        if (!userIds.has(userIdStr)) {
            orphanCount++;
            console.log(`Order ${order._id}: User ID ${userIdStr} NOT FOUND in Users collection.`);
        }
    }

    console.log(`Orphan Orders: ${orphanCount}`);

    console.log('--- Testing Populate ---');
    // Try to populate the first order
    const populatedOrder = await Order.findOne().populate('user', 'name email phone');
    console.log('Populated Order User:', populatedOrder.user);

    process.exit(0);
};

inspectOrders();

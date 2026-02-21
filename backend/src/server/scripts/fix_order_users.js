import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

const fixOrderUsers = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected.');

        const orders = await Order.find({});
        console.log(`Found ${orders.length} orders to check.`);

        let fixedCount = 0;
        let errorCount = 0;

        for (const order of orders) {
            let needsSave = false;
            const originalUser = order.user;

            // Check if user is a string that looks like an ObjectId
            if (typeof originalUser === 'string') {
                if (mongoose.Types.ObjectId.isValid(originalUser)) {
                    console.log(`Order ${order._id}: User is string "${originalUser}". Converting to ObjectId...`);
                    order.user = new mongoose.Types.ObjectId(originalUser);
                    needsSave = true;
                } else {
                    console.error(`Order ${order._id}: User "${originalUser}" is INVALID ObjectId string. Skipping.`);
                    errorCount++;
                }
            }
            // It might be that mongoose automatically casts it when we load it if the schema defines it as ObjectId.
            // So order.user might ALREADY be an ObjectId in existing memory if schema cast happened.
            // But if it was saved as a string in raw DB, we want to ensure it is saved back as ObjectId.
            // Mongoose 6+ often handles this transparently, but let's force a markModified if we suspect it.

            // If we are unsure, we can check the raw document using lean? No, we want to update.
            // We can just explicitly set it to ensure.

            if (originalUser && typeof originalUser === 'object' && originalUser.toString) {
                // It's likely an ObjectId already. 
                // console.log(`Order ${order._id}: User is already object/ObjectId: ${originalUser}`);
            }


            if (needsSave) {
                await order.save();
                fixedCount++;
                console.log(`Order ${order._id}: SAVED.`);
            }
        }

        console.log('--- Migration Summary ---');
        console.log(`Total Orders Checked: ${orders.length}`);
        console.log(`Fixed: ${fixedCount}`);
        console.log(`Errors: ${errorCount}`);

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

fixOrderUsers();

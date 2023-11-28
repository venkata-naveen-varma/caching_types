import mongoose from "mongoose";

export async function connectToDB() {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_API);
    } catch (err) {
        throw new Error(`Error while connecting to db - ${err}`);
    }
}

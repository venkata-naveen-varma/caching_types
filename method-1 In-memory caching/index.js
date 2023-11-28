import express from 'express';
import cache from 'memory-cache';
import dotenv from 'dotenv';
import { connectToDB } from './utils.js';
import User from './models/user.js';

dotenv.config();

const app = express();
const PORT = 8000;

// Method-1: In-Memory Caching
app.get('/api/data', async (req, res) => {
  const data = cache.get('data');
  if (data) {
    return res.json({"msg": "From Cache", data});
  } else {
    const newData = await User.find({}, {"displayName": 1});
    cache.put('data', newData, 60 * 1000); // cache for 1 minute
    return res.json({"msg": "From API", "data": newData});
  }
});

(async function init() {
    try {
        await connectToDB();
        app.listen(PORT, () => console.log("Server is listening at port", PORT));
    } catch (err) {
        console.warn(err);
    }
}());

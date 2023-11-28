const express = require('express');
const axios = require('axios');
const redis = require('redis');
 
const app = express();
 
const port = 3000;
 
// make a connection to the local instance of redis
const client = redis.createClient(6379);
client.on('error', err => console.log('Redis Client Error', err));
 
client.on("error", (error) => {
 console.error(error);
});
 
app.get('/posts/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Check the redis store for the data first
    const posts = await client.get(id);

    if(posts){
      return res.status(200).json({
        message: `Post for id:${id} from the cache`,
        data: posts
      })
    }else{
      // When the data is not found in the cache then we can make request to the server
      const data = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`);

      // save the record in the cache for subsequent request
      await client.set(id, JSON.stringify(data.data.title));
      await client.expire(id, 300);

      // return the result to the client
      return res.status(200).json({
        message: `Post for id:${id} from the server`,
        data: data.data.title
      });
    }
  } catch (error) {
      console.log(error)
  }
 });
  
 app.listen(port, async () => {
  await client.connect();
  console.log(`Server running on port ${port}`);
 });

 module.exports = app;
import { createClient } from 'redis';

const client = createClient({
    url : process.env.REDIS_URI
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

console.log("Redis Connected")

export default client;
const keys = require('./keys')
const redis = require('redis')

/* Here is the explanation for the code above:
1. Create a redis client
2. Connect to redis server
3. If redis server is down, retry every 1 second */
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
})

const sub = redisClient.duplicate()

/* Here is the explanation for the code above:
1. Create a new Redis client.
2. Duplicate this client to obtain a new client that shares the same
connection as the original client. */

// code does following
/* The code above does the following:
1. Creates a connection to the Redis server
2. Creates a second connection to the Redis server
3. When a message is received from the first connection, it is sent to the second connection
4. The second connection is used to publish the message to all the other clients */

/* The code above does the following, explained in English:
1. It creates a new Redis client.
2. It creates a new subscriber for that Redis client.
3. It subscribes to a channel.
4. It listens for that channel.
5. It executes a callback function when it receives a message on that channel. */

function fib(index) {
  if (index < 2) return 1
  return fib(index - 1) + fib(index - 2)
}
/* Here is the explanation for the code above:
1. We define a function called fib(index) that takes in an index as an argument.
2. We check if the index is less than 2, if so we return 1. This is the base case, we need to have a base case to stop the recursion. Otherwise, the function will run forever.
3. We return the sum of calling fib(index - 1) and fib(index - 2). This is the recursive case. We call the function recursively until we reach the base case. */

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)))
})
sub.subscribe('insert')

/* The code above does the following, explained in English:
1. Create a new Redis client
2. Create a new Redis client and subscribe to the 'insert' channel
3. Whenever we receive a new message on the 'insert' channel, we take that value and calculate the Fibonacci value for it
4. Then, we insert the value into the 'values' hash, where the key is the message (index) and the value is the Fibonacci value
5. We then record the index into the 'values' hash, where the key is the message (index) and the value is the Fibonacci value
6. We then record the index into the 'values' hash, where the key is the message (index) and the value is the Fibonacci value */

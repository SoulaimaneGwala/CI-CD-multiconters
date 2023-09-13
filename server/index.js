const keys = require("./keys")
const express = require("express")
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 4000


app.use(cors());
app.use(express.json());

const {Pool} = require('pg');

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDB,
    password: keys.pgPass,
    port: keys.pgPort
});


pgClient.on('error', () => console.log("lost PG connection"));
pgClient.on('connect', () => console.log("connected!!!!"))
pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch((err) => console.log)




const redis = require("redis")

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPORT,
    retry_strategy: () => 1000
})

const redisPublisher = redisClient.duplicate();



app.get("/", (req, res) => {
    res.send("Hello")
})


app.get("/values/all", async (req, res) => {
    // const values = await pgClient.query('SELECT * FROM values')

    // res.send(values.rows);
    res.send([])
})


app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values)
    })
})


app.post('/values', async (req, res) => {
    const index = parseInt(req.body.index);

    if(parseInt(index) > 40){
        return res.status(422).send('Index Too high')
    }

    console.log({index})
    
    await redisClient.hset('values', index, "Nothing Yet")
    
    console.log("inserting")
    await redisPublisher.publish('insert', index)
    
    console.log("querying")
    pgClient.query('INSERT INTO values (number) VALUES($1)', [index]).then(res => {

        console.log({res})
        res.send({working: true})

    }).catch(err => console.log)
    
})

app.listen(PORT, () => {
    console.log("Running on port:", PORT)
})
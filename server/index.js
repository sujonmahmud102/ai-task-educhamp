const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const OpenAI = require("openai");
const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send('server is working')
})


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.voqisr3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // collections
        const usersCollection = client.db('ai-task-db').collection('users');
        const promptsCollection = client.db('ai-task-db').collection('prompts');


        // user register
        app.post('/api/register', async (req, res) => {
            const user = req.body;
            // console.log(user);

            const query = {
                email: user.email
            };
            const existingUser = await usersCollection.findOne(query);
            // console.log('existing user', existingUser)

            if (existingUser) {
                return res.send({
                    message: 'user already exists'
                })
            }

            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // users api
        app.get('/api/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        // API endpoint to generate and store stories

        // prompts create
        app.post('/api/prompts', async (req, res) => {
            const {
                prompt,
                creatorName,
                creatorEmail
            } = req.body;

            const response = await openai.completions.create({
                model: "text-davinci-003",
                prompt: `${prompt}`,
                temperature: 0,
                max_tokens: 3000,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0,
            });

            // console.log(response)

            const newPrompt = {
                prompt,
                creatorName,
                creatorEmail,
                story: response.choices[0].text,

            }

            const result = await promptsCollection.insertOne(newPrompt);
            res.send(result);

        })

        // get prompts api
        app.get('/api/prompts', async (req, res) => {

            let query = {};
            if (req.query.creatorEmail) {
                query = {
                    creatorEmail: req.query.creatorEmail
                }
            }

            const result = await promptsCollection.find(query).toArray();
            res.send(result);
        })


        // add user for voted 
        app.patch('/api/upvoted/:id', async (req, res) => {
            const id = req.params.id;
            const {
                uid
            } = req.body;

            // console.log(id, uid)
            const filter = {
                _id: new ObjectId(id)
            };

            const updateDoc = {
                $addToSet: {
                    upvoted: uid
                }
            };
            const result = await promptsCollection.updateOne(filter, updateDoc);
            res.send(result);
        })


        // delete single chat
        app.delete("/api/delete/:id", async (req, res) => {
            const id = req.params.id;

            const filter = {
                _id: new ObjectId(id)
            };


            const result = await promptsCollection.deleteOne(filter);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);









app.listen(5000, () => {
    console.log('ai api server is running on port 5000')
})
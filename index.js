const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lfgd0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();
        const featuredCourseCollection = client.db('courseDB').collection('course')
        // featureCourse er jonno
        app.post('/featuredCourse', async (req, res) => {
            const featureCourse = req.body;
            console.log(featureCourse);
            const result = await featuredCourseCollection.insertOne(featureCourse);
            res.send(result);
        });
        app.get('/featuredCourse', async (req, res) => {
            const cursor = featuredCourseCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get('/featuredCourse/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await featuredCourseCollection.findOne(query);
            res.send(result);
        });

        // Newest course er jonno
        const newestCourseCollection = client.db("courseDB").collection('newest');
        app.post("/newest", async (req, res) => {
            const newestCourse = req.body;
            console.log(newestCourse);
            const result = await newestCourseCollection.insertOne(newestCourse);
            res.send(result)
        });
        app.get('/newest', async (req, res) => {
            const cursor = newestCourseCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get('/newest/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await newestCourseCollection.findOne(query);
            res.send(result);
        });

        // Instructorder jonno
        const instructorsCollection = client.db("courseDB").collection('Instructors');
        app.post("/instructor", async(req,res) =>{
            const Instructors = req.body;
            console.log(Instructors);
            const result = await instructorsCollection.insertOne(Instructors);
            res.send(result);
        });

        app.get('/instructor', async(req,res) =>{
            const cursor = instructorsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('inception automation server is running..')
})

app.listen(port, () => {
    console.log(`inception automation is running on port ${port}`)
})
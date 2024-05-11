const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;



//middleWare
app.use(
    cors({
      origin: [
        "http://localhost:5173",
        
      ],
      credentials: true,
      optionsSuccessStatus: 200
    })
  );


app.use(express.json())


//Mongodb connection


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.aq01puw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// console.log(uri);
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
   

    const CareerBuilderDb = client.db("CareerBuilderDB").collection('jobs');
    const applyJobCollectionDb = client.db("CareerBuilderDB").collection('applyJobs');
   

    //get api job
    app.get('/job', async(req,res) =>{
        const cursor = CareerBuilderDb.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    //job view details single
    app.get('/job/:id', async(req,res)=>{
        const id = req.params.id;
        const query ={_id : new ObjectId(id) };
        const result = await CareerBuilderDb.findOne(query);
        res.send(result);
    } )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//api testing on server side
app.get('/', (req, res) => {
  res.send('CareerBuilder Server Running')
})

app.get('/user', (req, res) => {
  res.send('CareerBuilder Server path User Running')
})

app.listen(port, () => {
  console.log(`CareerBuilder Server Running on port ${port}`)
})
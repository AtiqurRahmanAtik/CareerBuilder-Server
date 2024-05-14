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


    //add a job api
    app.post('/applyJob', async(req, res) =>{
        const user = req.body;
        console.log(user);
        const query = await applyJobCollectionDb.insertOne(user);
        const jobTitle = user.job_title;
        const result = await applyJobCollectionDb.updateOne(
            {job_title : jobTitle},
            { $inc: {applicants_number: 1}
        });
        res.send(result);

    })
    

    //all jobs page get api
    app.get('/applyJob', async(req,res)=>{
        
        const query = applyJobCollectionDb.find();
        const result = await query.toArray();
        res.send(result)
    })



    //my job api
    app.get('/myjobs/:email', async(req,res)=>{
        
        const result = await applyJobCollectionDb.find({email : req.params.email}).toArray();
        res.send(result);

    })


    //my job delete api
    app.delete('/myjob/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const result = await applyJobCollectionDb.deleteOne(query);
        res.send(result);

    })


    //single job get and for update
    app.get('/applyJob/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id : new ObjectId(id)};
        const result = await applyJobCollectionDb.findOne(query);
        res.send(result)
    })

    ///single job put and for update
    app.put('/applyJob/:id', async(req,res)=>{
        const id = req.params.id;
        const userData = req.body;
        const filter = { _id : new ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
             ...userData,
            },
          };

        const result = await applyJobCollectionDb.updateOne(filter,updateDoc,options);
        res.send(result)
    })


   


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
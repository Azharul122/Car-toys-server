const express = require("express");
const cors = require("cors");
const cars=require('./category.json')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000


const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))






app.use(express.json());

// console.log(process.env.DB_USER);
// console.log(process.env.DB_KEY);



app.get('/', (req, res) => {
    res.send("running")
})

app.listen(port,()=>{
console.log(`running on port :${port}`)
} )


app.get('/cars', (req, res) => {
    res.send(cars)
})

app.get('/cars/:id',(req,res)=>{
  const id=req.params.id

  const filterCar=cars.filter(car=>car.id==id)
  res.send(filterCar)
})




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@ass10.qe63rb5.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
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


    const toyCollection=client.db('toyDB').collection('toy')

    app.get('/toys',async(req,res)=>{
      const cursor=toyCollection.find()
      const result=await cursor.toArray()
      res.send(result)
    })

    app.get('/toy/:id', async(req, res) => {
      const toyId = req.params.id;
      const query={_id:new ObjectId(toyId)}
      const result=await toyCollection.findOne(query);
      res.send(result)
  })

  app.put('/toyUpdate/:id',async (req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    console.log(id)
    const options={upsert:true}
    const toy=req.body;
    console.log(toy)
    const updatedToy={
      $set:{
        quantity: toy.quantity,
        price: toy.price,
        description: toy.description
      }
    }
    const result=await toyCollection.updateOne(query,updatedToy);
    res.send(result)

  })

  app.delete('/toy/:id', async (req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)}
    const result=await toyCollection.deleteOne(query)
    res.send(result)
  })
    app.post('/toys/',async (req,res)=>{
      const newToy=req.body;
      console.log(newToy)
      const result=await toyCollection.insertOne(newToy)
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



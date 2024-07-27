
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://anon:1WouEkm5XlOTurNL@cluster0.7u22o.mongodb.net/?retryWrites=true&w=majority";
//const uri = "mongodb+srv://k2@k.com:Pa55w0rd@cluster0.7u22o.mongodb.net/?retryWrites=true&w=majority";////

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

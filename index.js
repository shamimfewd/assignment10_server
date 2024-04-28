const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// aP28c2e95g3gr0Nn
// assignment

const uri =
  "mongodb+srv://assignment:aP28c2e95g3gr0Nn@cluster0.ssblxww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const itemCollection = client.db("assignmentDB").collection("items");

    // post item
    app.post("/item", async (req, res) => {
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    });

    // get item

    app.get("/item", async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // get item for my list
    app.get("/item/:email", async (req, res) => {
      const quire = { email: req.params.email };
      const result = await itemCollection.find(quire).toArray();
      res.send(result);
    });
    // { email: req.params.email }

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("assignment 10 is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});

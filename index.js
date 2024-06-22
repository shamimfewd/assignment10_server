const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle ware
const corsConfig = {
  origin: ["http://localhost:5173", ""],
  credentials: true,
};
app.use(cors(corsConfig));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssblxww.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const itemCollection = client.db("assignmentDB").collection("items");
    const subCategoryCollection = client
      .db("assignmentDB")
      .collection("categoryItems");

    // subcategory get
    app.get("/cate", async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    // -------separate collection^^^^^^---------------------------------------

    // post item
    app.post("/item", async (req, res) => {
      const newItem = req.body;
      const result = await itemCollection.insertOne(newItem);
      res.send(result);
    });

    // get item for my list
    app.get("/item/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await itemCollection.find(query).toArray();
      res.send(result);
    });

    // delete item=====================
    app.delete("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.deleteOne(query);
      res.send(result);
    });

    // update item======================
    app.get("/itemData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await itemCollection.findOne(query);
      res.send(result);
    });

    app.put("/itemData/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const data = {
        $set: {
          itemName: req.body.itemName,
          price: req.body.price,
          rating: req.body.rating,
          shortDescription: req.body.shortDescription,
          userName: req.body.userName,
          email: req.body.email,
          processingTime: req.body.processingTime,
          selectedCategory: req.body.selectedCategory,
          selectedCustomize: req.body.selectedCustomize,
          selectedStocks: req.body.selectedStocks,
        },
      };

      const result = await itemCollection.updateOne(filter, data, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection

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

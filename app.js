const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

//MongoDB connection setup
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri); //create  new mongo client

//Middeleware to parse incoming JSON request
app.use(express.json());
// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
// console.log("dirName:",__dirname);

// Route to handle POST requests for adding an item
app.post("/add-item", async (req, res) => {
  try {
    // Extract required fields from the request body
    const { itemCode, itemName, category, qty, price, location } = req.body;

    // Validate that all fields are present
    if (!itemCode || !itemName || !category || !qty || !price || !location) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Calculate the item's price, discount, and final amount
    const tPrice = qty * price;
    let discountPrecent = 0;

    // Determine discount percentage based on the item's category
    if (category === "fruits") discountPrecent = 5;
    else if (category === "vegetables") discountPrecent = 10;
    else if (category === "stationary") discountPrecent = 3;

    const tdiscount = (tPrice * discountPrecent) / 100; // calcute the discount amount
    const tamount = tPrice - tdiscount;

    //create an item object with all details
    const item = {
      itemCode,
      itemName,
      category,
      qty,
      price,
      tPrice,
      tdiscount,
      tamount,
      location,
    };

    // Insert the item into the 'items' collection in the database
    await db.collection("items").insertOne(item);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to handle GET requests for retrieving all items
app.get("./items", async (res, req) => {
  try {
    // Retrieve all documents from the 'items' collection
    const items = await db.collection("items").find().toArray();
    res.json(items); //Respond with the list of items
  } catch (error) {
    console.error("Error Found",error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Self-executing function to start the server and connect to MongoDB
(async ()=>{

    try{
        await client.connect(); //connect to mongoDB server
        db = client.db('farm2home'); // set the databse to farm2home

        //start the express server
        app.listen(port,()=>{
            console.log(`server running at http://localhost:${port}`);
        });
    }catch(error){
         console.error('Error connecting mongoDB', error);
    }
})();
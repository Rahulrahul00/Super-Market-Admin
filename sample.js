const express = require('express'); // Import the Express library
const { MongoClient } = require('mongodb'); // Import the MongoDB client for database operations
const path = require('path'); // Import the 'path' module for handling and transforming file paths

const app = express(); // Create an instance of the Express application
const PORT = 3000; // Define the port number on which the server will listen

// MongoDB connection setup
const uri = 'mongodb://localhost:27017'; // MongoDB URI for connecting to the local database
const client = new MongoClient(uri); // Create a new MongoDB client instance
let db; // Placeholder for the database object after connection

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle POST requests for adding an item
app.post('/add-item', async (req, res) => {
    try {
        // Extract required fields from the request body
        const { itemCode, itemName, category, qty, rate, location } = req.body;
        
        // Validate that all fields are present
        if (!itemCode || !itemName || !category || !qty || !rate || !location) {
            return res.status(400).json({ message: 'All fields are required.' }); // Respond with a 400 error if validation fails
        }

        // Calculate the item's price, discount, and final amount
        const price = qty * rate; // Calculate the total price (qty * rate)
        let discountPercent = 0; // Initialize discount percentage

        // Determine discount percentage based on the item's category
        if (category === 'Fruits') discountPercent = 5;
        else if (category === 'Vegetables') discountPercent = 10;
        else if (category === 'Stationary') discountPercent = 3;

        // Calculate the discount and final amount
        const discount = (price * discountPercent) / 100; // Calculate the discount amount
        const amount = price - discount; // Calculate the final amount after applying the discount

        // Create an item object with all details
        const item = {
            itemCode,
            itemName,
            category,
            qty,
            rate,
            price,
            discount,
            amount,
            location,
        };

        // Insert the item into the 'items' collection in the database
        await db.collection('items').insertOne(item);
        res.status(201).json(item); // Respond with the inserted item and status 201
    } catch (error) {
        console.error(error); // Log any errors to the console
        res.status(500).json({ message: 'Internal server error.' }); // Respond with a 500 error for server issues
    }
});

// Route to handle GET requests for retrieving all items
app.get('/items', async (req, res) => {
    try {
        `// Retrieve all documents from the 'items' collection`
        const items = await db.collection('items').find().toArray();
        res.json(items); // Respond with the list of items
    } catch (error) {
        console.error(error); // Log any errors to the console
        res.status(500).json({ message: 'Internal server error.' }); // Respond with a 500 error for server issues
    }
});

// Self-executing function to start the server and connect to MongoDB
(async () => {
    try {
        await client.connect(); // Connect to the MongoDB server
        db = client.db('farmFresh'); // Set the database to 'farmFresh'

        // Start the Express server
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`); // Log the server's URL
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error); // Log any errors during MongoDB connection
    }
})();

// server.js

require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Check if MongoDB URI is defined
if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

// Function to ensure TTL index is created on time_of_active_fire
async function ensureIndexes() {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');

    // Create TTL index on time_of_active_fire with a 6-hour expiry (21600 seconds)
    await fireEventsCollection.createIndex(
      { time_of_active_fire: 1 },
      { expireAfterSeconds: 21600 }
    );

    console.log('TTL index ensured on time_of_active_fire field');
  } catch (error) {
    console.error('Error ensuring indexes:', error);
  } finally {
    await client.close();
  }
}

// Call ensureIndexes at the start to set up the TTL index
ensureIndexes().catch(console.error);

// Endpoint to receive fire event data from the ESP32
app.post('/api/fire-events', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');

    // Extract data from the request body
    const {
      sensor_id,
      latitude,
      longitude,
      time_of_active_fire,
      active_fire,
      location,
      state,
      region,
    } = req.body;

    // Insert or update fire event in the database
    const result = await fireEventsCollection.updateOne(
      { sensor_id },
      {
        $set: {
          latitude,
          longitude,
          time_of_active_fire: new Date(time_of_active_fire),
          active_fire,
          location,
          state,
          region,
        },
      },
      { upsert: true }
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error('Error updating fire event:', error);
    res.status(500).send('Error updating fire event');
  } finally {
    await client.close();
  }
});

// Endpoint to fetch all active fire events
app.get('/api/fire-events', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');

    // Fetch all active fire events
    const fireEvents = await fireEventsCollection.find({ active_fire: true }).toArray();
    res.json(fireEvents);
  } catch (error) {
    console.error('Error fetching fire events:', error);
    res.status(500).send('Error fetching fire events');
  } finally {
    await client.close();
  }
});

// Endpoint to fetch water resources
app.get('/api/water-resources', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const waterResourcesCollection = database.collection('water_resources');

    // Fetch all water resources
    const waterResources = await waterResourcesCollection.find({}).toArray();
    res.json(waterResources);
  } catch (error) {
    console.error('Error fetching water resources:', error);
    res.status(500).send('Error fetching water resources');
  } finally {
    await client.close();
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

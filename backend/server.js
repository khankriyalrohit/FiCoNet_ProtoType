require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.post('/api/fire-events', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');

    const { sensor_id, latitude, longitude, time_of_active_fire, active_fire } = req.body;

    const result = await fireEventsCollection.updateOne(
      { sensor_id },
      {
        $set: {
          latitude,
          longitude,
          time_of_active_fire,
          active_fire,
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

app.get('/api/fire-events', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');
    
    const fireEvents = await fireEventsCollection.find({ active_fire: true }).toArray();
    res.json(fireEvents);
  } catch (error) {
    console.error('Error fetching fire events:', error);
    res.status(500).send('Error fetching fire events');
  } finally {
    await client.close();
  }
});

app.get('/api/water-resources', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const waterResourcesCollection = database.collection('water_resources');
    
    const waterResources = await waterResourcesCollection.find({}).toArray();
    res.json(waterResources);
  } catch (error) {
    console.error('Error fetching water resources:', error);
    res.status(500).send('Error fetching water resources');
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// MongoDB URI and client
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is not defined in the .env file');
  process.exit(1);
}

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db, fireEventsCollection, waterResourcesCollection;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('FiCoNet');
    fireEventsCollection = db.collection('fire_events');
    waterResourcesCollection = db.collection('water_resources');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

connectToDatabase();

app.use(cors()); // Enable CORS
app.use(express.json());

// Function to update or create a fire event
async function updateFireEvent(
  sensor_id,
  latitude,
  longitude,
  time_of_active_fire,
  active_fire,
  location,
  state,
  region
) {
  try {
    const result = await fireEventsCollection.updateOne(
      { sensor_id },
      {
        $set: {
          latitude,
          longitude,
          time_of_active_fire,
          active_fire,
          location,
          state,
          region,
        },
      },
      { upsert: true }
    );

    return { success: true, result };
  } catch (error) {
    console.error('Error updating fire event:', error);
    throw error;
  }
}

// Route to update or create a fire event
app.post('/api/fire-events', async (req, res) => {
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

  try {
    const updateResult = await updateFireEvent(
      sensor_id,
      latitude,
      longitude,
      time_of_active_fire,
      active_fire,
      location,
      state,
      region
    );

    // Schedule deletion of the fire event after 6 hours
    setTimeout(async () => {
      try {
        const deleteResult = await fireEventsCollection.deleteOne({ sensor_id });
        console.log(`Deleted fire event with sensor_id: ${sensor_id} after 6 hours`);
      } catch (error) {
        console.error('Error deleting fire event:', error);
      }
    }, 21600000); // 6 hours in milliseconds

    res.json(updateResult);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error updating fire event' });
  }
});

// Route to fetch fire events with active_fire true
app.get('/api/fire-events', async (req, res) => {
  try {
    const fireEvents = await fireEventsCollection
      .find({ active_fire: true })
      .toArray();
    res.json(fireEvents);
  } catch (error) {
    console.error('Error fetching fire events:', error);
    res.status(500).send('Error fetching fire events');
  }
});

// Route to fetch all water resources
app.get('/api/water-resources', async (req, res) => {
  try {
    const waterResources = await waterResourcesCollection.find({}).toArray();
    res.json(waterResources);
  } catch (error) {
    console.error('Error fetching water resources:', error);
    res.status(500).send('Error fetching water resources');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

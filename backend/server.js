require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors()); // Add this line to enable CORS
app.use(express.json());

// Function to update or create a fire event
async function updateFireEvent(sensor_id, latitude, longitude, time_of_active_fire, active_fire, location, state, region) {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');

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
          region
        },
      },
      { upsert: true }
    );

    return { success: true, result };
  } catch (error) {
    console.error('Error updating fire event:', error);
    throw error;
  } finally {
    await client.close();
  }
}

// Route to update or create a fire event
app.post('/api/fire-events', async (req, res) => {
  const { sensor_id, latitude, longitude, time_of_active_fire, active_fire, location, state, region } = req.body;

  try {
    const updateResult = await updateFireEvent(sensor_id, latitude, longitude, time_of_active_fire, active_fire, location, state, region);

    // Schedule deletion of the fire event after 6 hours
    setTimeout(async () => {
      try {
        await client.connect();
        const database = client.db('FiCoNet'); // Your database name
        const fireEventsCollection = database.collection('fire_events');

        const deleteResult = await fireEventsCollection.deleteOne({ sensor_id });
        console.log(`Deleted fire event with sensor_id: ${sensor_id} after 6 hours`);
      } catch (error) {
        console.error('Error deleting fire event:', error);
      } finally {
        await client.close();
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

// Route to fetch all water resources
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

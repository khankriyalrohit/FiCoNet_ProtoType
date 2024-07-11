const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const fireEvents = [
  { _id: 1, sensor_id: "sensor_123", latitude: 30.7333, longitude: 76.7794, time_of_active_fire: new Date("2024-06-25T12:34:56Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 3, sensor_id: "sensor_124", latitude: 30.8333, longitude: 76.6794, time_of_active_fire: new Date("2024-06-25T12:34:56Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 4, sensor_id: "sensor_1", latitude: 30.391, longitude: 78.48, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 5, sensor_id: "sensor_2", latitude: 30.392, longitude: 78.4785, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 6, sensor_id: "sensor_3", latitude: 30.392, longitude: 78.4815, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 7, sensor_id: "sensor_4", latitude: 30.39, longitude: 78.4785, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 8, sensor_id: "sensor_5", latitude: 30.39, longitude: 78.4815, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 9, sensor_id: "sensor_6", latitude: 30.391, longitude: 78.4785, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
  { _id: 10, sensor_id: "sensor_7", latitude: 30.391, longitude: 78.4815, time_of_active_fire: new Date("2024-06-24T10:00:00Z"), active_fire: true, location: "Tehri", state: "Uttarakhand", region: "Northern" },
];

const waterResources = [
  { _id: 1, latitude: 30.391, longitude: 78.484, type: "Lake" },
  { _id: 2, latitude: 30.392, longitude: 78.485, type: "River" },
  { _id: 3, latitude: 30.393, longitude: 78.486, type: "Well" },
  { _id: 4, latitude: 30.394, longitude: 78.487, type: "Pond" },
  { _id: 5, latitude: 30.395, longitude: 78.488, type: "Spring" },
  { _id: 6, latitude: 30.396, longitude: 78.489, type: "Reservoir" },
  { _id: 7, latitude: 30.397, longitude: 78.49, type: "Stream" },
  { _id: 8, latitude: 30.398, longitude: 78.491, type: "Lake" },
  { _id: 9, latitude: 30.399, longitude: 78.492, type: "River" },
  { _id: 10, latitude: 30.4, longitude: 78.493, type: "Well" },
  { _id: 11, latitude: 30.401, longitude: 78.494, type: "Pond" },
  { _id: 12, latitude: 30.402, longitude: 78.495, type: "Spring" },
  { _id: 13, latitude: 30.403, longitude: 78.496, type: "Reservoir" },
  { _id: 14, latitude: 30.404, longitude: 78.497, type: "Stream" },
  { _id: 15, latitude: 30.405, longitude: 78.498, type: "Lake" },
  { _id: 16, latitude: 30.406, longitude: 78.499, type: "River" },
  { _id: 17, latitude: 30.407, longitude: 78.5, type: "Well" },
  { _id: 18, latitude: 30.408, longitude: 78.501, type: "Pond" },
  { _id: 19, latitude: 30.409, longitude: 78.502, type: "Spring" },
  { _id: 20, latitude: 30.41, longitude: 78.503, type: "Reservoir" },
];

async function run() {
  try {
    await client.connect();
    const database = client.db('FiCoNet'); // Your database name
    const fireEventsCollection = database.collection('fire_events');
    const waterResourcesCollection = database.collection('water_resources');

    const fireEventsResult = await fireEventsCollection.insertMany(fireEvents);
    console.log(`${fireEventsResult.insertedCount} documents were inserted into fire_events`);

    const waterResourcesResult = await waterResourcesCollection.insertMany(waterResources);
    console.log(`${waterResourcesResult.insertedCount} documents were inserted into water_resources`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

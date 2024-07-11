const { Client } = require('pg');
const fs = require('fs');
const parse = require('csv-parse');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'fire_events_db',
  password: 'rohit',
  port: 5432,
});

client.connect();

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS fire_events (
    id SERIAL PRIMARY KEY,
    Sensor_ID VARCHAR(255),
    Latitude FLOAT,
    Longitude FLOAT,
    Time_of_Active_Fire TIMESTAMP,
    Active_Fire BOOLEAN,
    District VARCHAR(255),
    State VARCHAR(255),
    Region VARCHAR(255)
  );
`;

client.query(createTableQuery)
  .then(() => {
    const csvData = [];
    fs.createReadStream('path/to/data.csv')
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => {
        const insertQuery = `
          INSERT INTO fire_events (
            Sensor_ID, Latitude, Longitude, Time_of_Active_Fire, Active_Fire, District, State, Region
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `;

        csvData.forEach((row) => {
          client.query(insertQuery, row, (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Inserted:', res.rowCount);
            }
          });
        });
      });
  })
  .catch(err => console.log(err))
  .finally(() => client.end());

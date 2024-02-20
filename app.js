const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const port = 3000


app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

// Define the path to the coordinates.txt file
const coordinatesFilePath = path.join(__dirname, 'coordinates.txt');

// Handle GET request to /coords
app.get('/coords', (req, res) => {
  // Read the coordinates from the coordinates.txt file
  fs.readFile(coordinatesFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Error reading coordinates');
    } else {
      // Extract numerical values for latitude and longitude from the file content
      const latitudeMatch = data.match(/Latitude:\s*(-?\d+\.\d+)/);
      const longitudeMatch = data.match(/Longitude:\s*(-?\d+\.\d+)/);
      
      if (!latitudeMatch || !longitudeMatch) {
        res.status(500).send('Invalid format in coordinates.txt');
        return;
      }

      const latitude = parseFloat(latitudeMatch[1]);
      const longitude = parseFloat(longitudeMatch[1]);
      
      // Send latitude and longitude as JSON response
      res.json({ latitude, longitude });
    }
  });
});

app.post('/found', (req, res) => {
  console.log(req)
  const { latitude, longitude } = req.body;

  // Overwrite latitude and longitude in the text file
  const data = `Latitude: ${latitude}, Longitude: ${longitude}\n`;

  fs.writeFile('coordinates.txt', data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      res.status(500).send('Error writing to file');
    } else {
      console.log('Coordinates updated successfully');
      res.status(200).send('Coordinates updated successfully');
    }
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Optional: Serve Index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

app.listen(port, () => {
  console.log(`Todo app server running at http://localhost:${port}`);
});


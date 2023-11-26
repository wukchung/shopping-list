const express = require('express');
const app = require('./src/app'); // Import the core Express setup

const PORT = process.env.PORT || 3000; // Set the port

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'test') {
  const mongoDBUri = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/mydb'; // Default URI

  mongoose.connect(mongoDBUri, {useNewUrlParser: true, useUnifiedTopology: true});

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected!');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(-1);
  });
}

module.exports = mongoose;

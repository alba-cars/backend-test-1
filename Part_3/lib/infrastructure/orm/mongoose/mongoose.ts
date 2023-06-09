import mongoose from 'mongoose';
import environment from '../../config/environment';

mongoose.set("strictQuery", false);
// mongoose.connect(environment.database.url);
mongoose.connect("mongodb://127.0.0.1:27017/test");

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB database!');
});

export default mongoose;

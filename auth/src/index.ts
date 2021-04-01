import mongoose from 'mongoose';
import { app } from './app';

const port = 3000;

const start = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT key not defined');

  try {
    await mongoose.connect('mongodb://auth-mongo-svc:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongodb');
  } catch (err) {
    console.error(err);
  }

  app.listen(port, () => {
    console.log('Listening on ' + port);
  });
};

start();

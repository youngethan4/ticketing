import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'ahhh';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) await collection.deleteMany({});
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  //Build jwt payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'email@email.com',
  };
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object {jwt: MY_JWT}
  const session = { jwt: token };

  //turn into session json
  const sessionJSON = JSON.stringify(session);

  //encode to base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return the string
  return [`express:sess=${base64}`];
};

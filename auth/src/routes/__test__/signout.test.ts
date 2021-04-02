import request from 'supertest';
import { app } from '../../app';

const signout = '/api/users/signout';
const signup = '/api/users/signup';

it('clears cookie', async () => {
  await request(app)
    .post(signup)
    .send({ email: 'test@test.com', password: 'pass' })
    .expect(201);

  const res = await request(app).post(signout).send({}).expect(200);
  expect(res.get('Set-Cookie')).toBeDefined();
});

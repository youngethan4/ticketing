import request from 'supertest';
import { app } from '../../app';

const currentuser = '/api/users/currentuser';
const signup = '/api/users/signup';

it('responds with details on current user', async () => {
  const cookie = await global.signup();

  const res = await request(app)
    .get(currentuser)
    .set('Cookie', cookie)
    .send()
    .expect(400);

  expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if non auth', async () => {
  const res = await request(app).get(currentuser).send().expect(200);

  expect(res.body.currentUser).toBeNull();
});

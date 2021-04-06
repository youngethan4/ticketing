import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const endpoint = '/api/tickets';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post(endpoint).send({});
  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post(endpoint).send({}).expect(401);
});

it('returns status other than 401', async () => {
  const response = await request(app)
    .post(endpoint)
    .set('Cookie', global.signup())
    .send({});
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post(endpoint)
    .set('Cookie', global.signup())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post(endpoint)
    .set('Cookie', global.signup())
    .send({ price: 10 })
    .expect(400);
});

it('returns an error if aan invalid price is provided', async () => {
  await request(app)
    .post(endpoint)
    .set('Cookie', global.signup())
    .send({ title: 'fdsafdsa', price: -10 })
    .expect(400);

  await request(app)
    .post(endpoint)
    .set('Cookie', global.signup())
    .send({ title: 'fdsafdsa' })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'fdafdsa';
  const price = 10;

  await request(app)
    .post(endpoint)
    .set('Cookie', global.signup())
    .send({ title, price })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});

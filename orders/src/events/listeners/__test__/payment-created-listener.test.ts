import { natsWrapper } from '../../../nats-wrapper';
import { OrderStatus, PaymentCreatedEvent } from '@ey-tickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { PaymentCreatedListener } from '../payment-created-listener';
import { Order } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new PaymentCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'cdafdsa',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create a fake data event
  const data: PaymentCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    stripeId: 'fdsafd',
    orderId: order.id,
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.orderId);
  expect(order).toBeDefined();
  expect(order!.status).toEqual(OrderStatus.Complete);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

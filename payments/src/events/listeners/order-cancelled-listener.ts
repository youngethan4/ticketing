import {
  OrderCancelledEvent,
  Subjects,
  Listener,
  OrderStatus,
} from '@ey-tickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByEvent(data);
    if (!order) throw new Error('order not found');

    order.set({ status: OrderStatus.Cancelled, version: data.version });
    await order.save();

    msg.ack();
  }
}

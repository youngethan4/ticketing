import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) return <div>Order expired</div>;

  const stripeKey =
    'pk_test_51IgG05Cz2CCTxQsensosdiSDGX8yArtMYhwbc09gzIphld1FrC70VDZ4GeoSg5c3eXJ2gb6yAbFdpvEX0en2GeFH00l5BWqnqC';

  return (
    <div>
      <h1>Purchasing {order.ticket.title}</h1>
      <p>Time left to pay: {timeLeft} seconds</p>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={stripeKey}
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;

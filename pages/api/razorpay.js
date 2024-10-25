import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount } = req.body;

    try {
      const instance = new Razorpay({
        key_id: rzp_test_8YlkRAtlW7b1zk,
        key_secret: xsWDOt4C1tpJXmL7nJBzDrf2,
      });

      const order = await instance.orders.create({
        amount: amount * 100, // Razorpay accepts amounts in paise (i.e., INR * 100)
        currency: 'INR',
        payment_capture: 1, // 1 for auto capture
      });

      res.status(200).json(order);
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

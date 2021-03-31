import express from 'express';
const router = express.Router();

router.post('/api/users/signin', (req, res) => {
  res.send('He there boi!');
});

export { router as signinRouter };

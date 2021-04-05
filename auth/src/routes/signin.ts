import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@ey-tickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const exsistingUser = await User.findOne({ email });
    if (!exsistingUser) throw new BadRequestError('Invalid credentials');

    const passwordsMatch = await Password.compare(
      exsistingUser.password,
      password
    );
    if (!passwordsMatch) throw new BadRequestError('Invalid credentials');

    const userJwt = jwt.sign(
      {
        id: exsistingUser.id,
        email: exsistingUser.email,
      },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };

    res.status(200).send(exsistingUser);
  }
);

export { router as signinRouter };

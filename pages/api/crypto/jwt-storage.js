import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  const username = req.body.username;
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1d' });
  const sToken = jwt.sign({ username, token }, SECRET, { expiresIn: '30d' });

  const serialized = serialize('sToken', sToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });

  res.setHeader('Set-Cookie', serialized);
  res.status(200).json({ token });
}

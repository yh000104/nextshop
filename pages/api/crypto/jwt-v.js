import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export default function handler(req, res) {
  const token = req.body.token;

  const result = jwt.verify(token, SECRET);

  res.status(200).json({ result });
}

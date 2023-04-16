import { getSession } from 'next-auth/react';
import LoginLog from '../../../models/LoginLog';
import db from '../../../utils/db';

async function handler(req, res) {
  const provider = req.body.provider;
  console.log(provider);

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'signin required' });
  }
  const { user } = session;
  const email = user.email;

  await db.connect();

  const newLoginLog = new LoginLog({
    provider,
    email,
  });

  await newLoginLog.save();
  await db.disconnect();
  res.json({ message: 'Login is logged' });
}

export default handler;

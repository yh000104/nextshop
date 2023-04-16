import bcrypt from 'bcryptjs';

export default function handler(req, res) {
  const password = req.body.password;
  const password1 = req.body.password1;

  let hpassword = bcrypt.hashSync(password, 8);
  let result = bcrypt.compareSync(password1, hpassword);

  res.status(200).json({ result });
}

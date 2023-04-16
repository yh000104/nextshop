import forge from 'node-forge';

export default function handler(req, res) {
  const password = req.body.password;
  const salt = req.body.salt;
  const iteration = parseInt(req.body.iteration);
  const keyLength = parseInt(req.body.keyLength);

  const derivedKey = forge.util.bytesToHex(
    forge.pkcs5.pbkdf2(password, salt, iteration, keyLength)
  );

  res.status(200).json({ key: derivedKey });
}

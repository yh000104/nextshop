import forge from 'node-forge';

const computeHash = (algorithm, inputText) => {
  let md;
  switch (algorithm) {
    case 'md5':
      md = forge.md.md5.create();
      md.update(inputText);
      return md.digest().toHex();
    case 'sha1':
      md = forge.md.sha1.create();
      md.update(inputText);
      return md.digest().toHex();
    case 'sha256':
      md = forge.md.sha256.create();
      md.update(inputText);
      return md.digest().toHex();
    case 'sha384':
      md = forge.md.sha384.create();
      md.update(inputText);
      return md.digest().toHex();
    case 'sha512':
      md = forge.md.sha512.create();
      md.update(inputText);
      return md.digest().toHex();
  }
};

const computeHmac = (algorithm, secret, inputText) => {
  let hmac = forge.hmac.create();
  hmac.start(algorithm, secret);
  hmac.update(inputText);
  return hmac.digest().toHex();
};

export { computeHash, computeHmac };

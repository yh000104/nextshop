import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Image from 'next/image';
import symmetricPic from '../../public/symmetric.jpg';
import forge from 'node-forge';

export default function AESScreen() {
  const modes = ['ECB', 'CBC'];
  const lengths = [128, 192, 256];

  const [mode, setMode] = useState('CBC');
  const [keyLength, setKeyLength] = useState(128);
  const [key, setKey] = useState('');
  const [keyHex, setKeyHex] = useState('');
  const [iv, setIv] = useState('');
  const [ivHex, setIvHex] = useState('');
  const [plaintext, setPlaintext] = useState(
    'Hello world - 헬로월드 - 全国の新たな感染者 - 备孕者可以接种新冠疫苗'
  );
  const [ciphertext, setCiphertext] = useState('');
  const [ciphertextHex, setCiphertextHex] = useState('');
  const [recoveredtext, setRecoveredtext] = useState('');

  const randomKey = () => {
    let key = forge.random.getBytesSync(keyLength / 8);
    let keyHex = forge.util.bytesToHex(key);
    let iv, ivHex;
    if (mode === 'ECB') {
      iv = '';
      ivHex = '';
    } else if (mode === 'CBC') {
      iv = forge.random.getBytesSync(keyLength / 8);
      ivHex = forge.util.bytesToHex(iv);
    }
    setKey(key);
    setKeyHex(keyHex);
    setIv(iv);
    setIvHex(ivHex);
  };

  const encryptHandler = () => {
    if (mode === 'ECB') {
      let cipher = forge.cipher.createCipher('AES-ECB', key);
      cipher.start();
      cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(plaintext)));
      cipher.finish();
      setCiphertext(cipher.output);
      setCiphertextHex(cipher.output.toHex());
    } else if (mode === 'CBC') {
      let cipher = forge.cipher.createCipher('AES-CBC', key);
      cipher.start({ iv: iv });
      cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(plaintext)));
      cipher.finish();
      setCiphertext(cipher.output);
      setCiphertextHex(cipher.output.toHex());
    }
  };

  const decryptHandler = () => {
    if (mode === 'ECB') {
      let decipher = forge.cipher.createDecipher('AES-ECB', key);
      decipher.start();
      decipher.update(ciphertext);
      decipher.finish();
      setRecoveredtext(decipher.output);
    } else if (mode === 'CBC') {
      let decipher = forge.cipher.createDecipher('AES-CBC', key);
      decipher.start({ iv: iv });
      decipher.update(ciphertext);
      decipher.finish();
      setRecoveredtext(decipher.output);
    }
  };

  return (
    <Layout title="AES">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">AES (대칭키 암호화)</h1>

        <div className="mb-4 ">
          <p>
            대칭키 암호는 암호화 알고리즘과 복호화 알고리즘에서 동일한 키를
            사용하는 알고리즘이다. 송신자는 일반적으로 난수생성함수를 이용하여
            임의로 생성한 키를 사용하여 암호화하며 송신자는 이 키를 수신자에게
            안전하게 전달해야 한다.
          </p>
          <div className="mx-auto px-20">
            <Image src={symmetricPic} alt="AES" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="mode" className="mb-3 font-bold">
            Select Mode (default to CBC)
          </label>
          {modes.map((mode) => (
            <div key={mode} className="mx-4 ">
              <input
                name="mode"
                className="p-2 outline-none focus:ring-0"
                id={mode}
                type="radio"
                onChange={() => setMode(mode)}
              />
              <label className="p-2" htmlFor={mode}>
                {mode}
              </label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="mode" className="mb-3 font-bold">
            Select Key Length (default to 128)
          </label>
          {lengths.map((length) => (
            <div key={length} className="mx-4 ">
              <input
                name="length"
                className="p-2 outline-none focus:ring-0"
                id={length}
                type="radio"
                onChange={() => setKeyLength(length)}
              />
              <label className="p-2" htmlFor={length}>
                {length}
              </label>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="key" className="mb-3 font-bold">
            AES key
          </label>
          <input
            type="text"
            name="key"
            id="key"
            className="w-full bg-gray-50"
            value={keyHex}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="iv" className="mb-3 font-bold">
            AES iv
          </label>
          <input
            type="text"
            name="iv"
            id="iv"
            className="w-full bg-gray-50"
            value={ivHex}
            readOnly
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={randomKey}
          >
            Random key generation (난수 키 생성)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="plaintext" className="mb-3 font-bold">
            Plaintext
          </label>
          <textarea
            type="text"
            name="plaintext"
            id="plaintext"
            cols="50"
            rows="2"
            className="w-full bg-gray-50"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={encryptHandler}
          >
            Encrypt (암호화)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="ciphertext" className="mb-3 font-bold">
            Ciphertext
          </label>
          <textarea
            type="text"
            name="ciphertext"
            id="ciphertext"
            cols="50"
            rows="4"
            className="w-full bg-gray-50"
            value={ciphertextHex}
            readOnly
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={decryptHandler}
          >
            Decrypt (복호화)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="recoveredtext" className="mb-3 font-bold">
            Recoveredtext
          </label>
          <textarea
            type="text"
            name="recoveredtext"
            id="recoveredtext"
            cols="50"
            rows="2"
            className="w-full bg-gray-50"
            value={recoveredtext}
            readOnly
          />
        </div>
      </form>
    </Layout>
  );
}

import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Image from 'next/image';
import rsakeyPic from '../../public/rsa-key.jpg';
import rsaencPic from '../../public/rsa-enc.jpg';
import forge from 'node-forge';

const rsa = forge.pki.rsa;
const pki = forge.pki;

export default function RSAEncScreen() {
  const lengths = [1024, 2048, 3072];

  const [keyLength, setKeyLength] = useState(1024);
  const [publicKey, setPublicKey] = useState('');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');
  const [n, setN] = useState();
  const [p, setP] = useState();
  const [q, setQ] = useState();
  const [e, setE] = useState();
  const [d, setD] = useState();

  const [plaintext, setPlaintext] = useState('Hello world - 헬로월드');
  const [ciphertext, setCiphertext] = useState('');
  const [ciphertextHex, setCiphertextHex] = useState('');
  const [recoveredtext, setRecoveredtext] = useState('');

  const keyGen = () => {
    const keypair = rsa.generateKeyPair({ bits: keyLength, e: 0x10001 });
    setPublicKey(keypair.publicKey);
    setPublicKeyPem(pki.publicKeyToPem(keypair.publicKey));
    setPrivateKey(keypair.privateKey);
    setPrivateKeyPem(pki.privateKeyToPem(keypair.privateKey));
    setN(keypair.publicKey.n);
    setE(keypair.publicKey.e);
    setP(keypair.privateKey.p);
    setQ(keypair.privateKey.q);
    setD(keypair.privateKey.d);
  };

  const encryptHandler = () => {
    let bytes = forge.util.encodeUtf8(plaintext);
    let encrypted = publicKey.encrypt(bytes);
    let encryptedHex = forge.util.bytesToHex(encrypted);
    setCiphertext(encrypted);
    setCiphertextHex(encryptedHex);
  };

  const decryptHandler = () => {
    let decrypted = privateKey.decrypt(ciphertext);
    setRecoveredtext(forge.util.decodeUtf8(decrypted));
  };

  return (
    <Layout title="RSA-Enc">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">
          RSA Encryption (공개키 암호화)
        </h1>

        <div className="mb-4 ">
          <p>
            RSA는 공개키 암호시스템의 하나로, 암호화뿐만 아니라 전자서명이
            가능한 최초의 알고리즘으로 알려져 있다. RSA가 갖는 전자서명 기능은
            인증을 요구하는 전자 상거래 등에 RSA의 광범위한 활용을 가능하게
            하였다. 1978년 로널드 라이베스트(Ron Rivest), 아디 샤미르(Adi
            Shamir), 레너드 애들먼(Leonard Adleman)의 연구에 의해
            체계화되었으며, RSA라는 이름은 이들 3명의 이름 앞글자를 딴 것이다.
            이 세 발명자는 이 공로로 2002년 튜링상을 수상했다.
          </p>
          <div className="mx-auto px-20">
            <Image src={rsakeyPic} alt="RSA key generation" />
            <Image src={rsaencPic} alt="RSA encryption" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="mode" className="mb-3 font-bold">
            Select Key Length (default to 1024)
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
          <button
            className="primary-button w-full"
            type="button"
            onClick={keyGen}
          >
            RSA key generation (RSA 키 생성)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="key" className="mb-3 font-bold">
            Public Key (공개키)
          </label>
          <textarea
            type="text"
            name="key"
            id="key"
            cols="50"
            rows="5"
            className="w-full bg-gray-50"
            value={publicKeyPem}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="key" className="mb-3 font-bold">
            Private Key (개인키)
          </label>
          <textarea
            type="text"
            name="key"
            id="key"
            cols="50"
            rows="5"
            className="w-full bg-gray-50"
            value={privateKeyPem}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="n" className="mb-3 font-bold">
            키 상세 정보 n=pq
          </label>
          <textarea
            type="text"
            name="n"
            id="n"
            cols="50"
            rows="5"
            className="w-full bg-gray-50"
            value={n}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="p" className="mb-3 font-bold">
            키 상세 정보 p
          </label>
          <textarea
            type="text"
            name="p"
            id="p"
            cols="50"
            rows="2"
            className="w-full bg-gray-50"
            value={p}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="q" className="mb-3 font-bold">
            키 상세 정보 q
          </label>
          <textarea
            type="text"
            name="q"
            id="q"
            cols="50"
            rows="2"
            className="w-full bg-gray-50"
            value={q}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="n" className="mb-3 font-bold">
            키 상세 정보 e
          </label>
          <input
            type="text"
            name="e"
            id="e"
            className="w-full bg-gray-50"
            value={e}
            readOnly
          />
        </div>

        <div className="mb-4">
          <label htmlFor="d" className="mb-3 font-bold">
            키 상세 정보 d
          </label>
          <textarea
            type="text"
            name="d"
            id="d"
            cols="50"
            rows="5"
            className="w-full bg-gray-50"
            value={d}
            readOnly
          />
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
            rows="3"
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
            rows="6"
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
            rows="3"
            className="w-full bg-gray-50"
            value={recoveredtext}
            readOnly
          />
        </div>
      </form>
    </Layout>
  );
}

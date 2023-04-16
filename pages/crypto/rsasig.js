import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Image from 'next/image';
import rsakeyPic from '../../public/rsa-key.jpg';
import rsaencPic from '../../public/rsa-enc.jpg';
import forge from 'node-forge';

const rsa = forge.pki.rsa;
const pki = forge.pki;

export default function RSASigScreen() {
  const lengths = [1024, 2048, 3072];

  const [keyLength, setKeyLength] = useState(1024);
  const [publicKey, setPublicKey] = useState('');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');

  const [plaintext, setPlaintext] = useState('Hello world - 헬로월드');
  const [signature, setSignature] = useState('');
  const [signatureHex, setSignatureHex] = useState('');
  const [result, setResult] = useState('');

  const keyGen = () => {
    const keypair = rsa.generateKeyPair({ bits: keyLength, e: 0x10001 });
    setPublicKey(keypair.publicKey);
    setPublicKeyPem(pki.publicKeyToPem(keypair.publicKey));
    setPrivateKey(keypair.privateKey);
    setPrivateKeyPem(pki.privateKeyToPem(keypair.privateKey));
  };

  const signHandler = () => {
    let pss = forge.pss.create({
      md: forge.md.sha1.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
      saltLength: 20,
    });
    let md = forge.md.sha256.create();
    md.update(plaintext, 'utf8');
    let sig = privateKey.sign(md, pss);
    setSignature(sig);
    setSignatureHex(forge.util.bytesToHex(sig));
  };

  const verifyHandler = () => {
    let pss = forge.pss.create({
      md: forge.md.sha1.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha1.create()),
      saltLength: 20,
    });
    let md = forge.md.sha256.create();
    md.update(plaintext, 'utf8');
    let verified = publicKey.verify(md.digest().bytes(), signature, pss);
    setResult(verified ? '서명 검증 OK' : '서명 Error');
  };

  return (
    <Layout title="RSA-Sig">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">RSA Signature (전자서명)</h1>

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
            onClick={signHandler}
          >
            Signing (전자서명 생성)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="ciphertext" className="mb-3 font-bold">
            Signature
          </label>
          <textarea
            type="text"
            name="signature"
            id="signature"
            cols="50"
            rows="6"
            className="w-full bg-gray-50"
            value={signatureHex}
            readOnly
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={verifyHandler}
          >
            Verification (전자서명 검증)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="recoveredtext" className="mb-3 font-bold">
            Result
          </label>
          <input
            type="text"
            name="recoveredtext"
            id="recoveredtext"
            className="w-full bg-gray-50"
            value={result}
            readOnly
          />
        </div>
      </form>
    </Layout>
  );
}

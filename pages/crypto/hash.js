import React, { useState } from 'react';
import Layout from '../../components/Layout';
import forge from 'node-forge';
import Image from 'next/image';
import hashPic from '../../public/hash.jpg';
import axios from 'axios';

export default function HashScreen() {
  const algorithms = ['md5', 'sha1', 'sha256', 'sha384', 'sha512'];

  const [algorithm, setAlgorithm] = useState('sha256');
  const [inputText, setInputText] = useState('input your message');
  const [hashValue1, setHashValue1] = useState('');
  const [hashValue2, setHashValue2] = useState('');

  const submitHandler = async () => {
    await axios
      .post('/api/crypto/hash', { algorithm, inputText })
      .then((res) => {
        setHashValue2(res.data.hashValue);
      });

    switch (algorithm) {
      case 'md5':
        // eslint-disable-next-line no-case-declarations
        let md1 = forge.md.md5.create();
        md1.update(inputText);
        setHashValue1(md1.digest().toHex());
        return;
      case 'sha1':
        // eslint-disable-next-line no-case-declarations
        let md2 = forge.md.sha1.create();
        md2.update(inputText);
        setHashValue1(md2.digest().toHex());
        return;
      case 'sha256':
        // eslint-disable-next-line no-case-declarations
        var md3 = forge.md.sha256.create();
        md3.update(inputText);
        setHashValue1(md3.digest().toHex());
        return;
      case 'sha384':
        // eslint-disable-next-line no-case-declarations
        var md4 = forge.md.sha384.create();
        md4.update(inputText);
        setHashValue1(md4.digest().toHex());
        return;
      case 'sha512':
        // eslint-disable-next-line no-case-declarations
        var md5 = forge.md.sha512.create();
        md5.update(inputText);
        setHashValue1(md5.digest().toHex());
        return;
    }
  };

  return (
    <Layout title="Hash">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">Hash (해시함수)</h1>

        <div className="mb-4 flex flex-row">
          <div className="basis-1/2">
            <label htmlFor="algo" className="mb-3 font-bold">
              Select Hash Algorithm (default to sha256)
            </label>
            {algorithms.map((algo) => (
              <div key={algo} className="mx-4 ">
                <input
                  name="algo"
                  className="p-2 outline-none focus:ring-0"
                  id={algo}
                  type="radio"
                  onChange={() => setAlgorithm(algo)}
                />
                <label className="p-2" htmlFor={algo}>
                  {algo}
                </label>
              </div>
            ))}
          </div>
          <div className="basis-1/2">
            <Image src={hashPic} alt="hash function" />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="input" className="font-bold">
            Input Message
          </label>
          <textarea
            name="input"
            id="input"
            cols="50"
            rows="3"
            className="w-full bg-gray-50"
            autoFocus
            placeholder="텍스트를 입력하세요"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={submitHandler}
          >
            Compute Hash
          </button>
        </div>

        <div className="mb-4 overflow-x-auto">
          <h2 className="mb-3 font-bold">Result</h2>
          <div className="px-4 bg-slate-200">
            <p>Hash algorithm: {algorithm}</p>
            <p>Input text: {inputText}</p>
            <p className="overflow-x-auto text-red-700">
              Hash value (client-side): {hashValue1} ({hashValue1.length * 4}{' '}
              bits)
            </p>
            <p className="overflow-x-auto  text-blue-700">
              Hash value (server-side): {hashValue2} ({hashValue2.length * 4}{' '}
              bits)
            </p>
          </div>
        </div>
      </form>
    </Layout>
  );
}

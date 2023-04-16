import React, { useState } from 'react';
import Layout from '../../components/Layout';
import forge from 'node-forge';
import Image from 'next/image';
import pbkdf2Pic from '../../public/pbkdf2.jpg';
import axios from 'axios';

export default function Pbkdf2Screen() {
  const [password, setPassword] = useState('supersecretpassword');
  const [salt, setSalt] = useState('');
  const [iteration, setIteration] = useState(1000);
  const [keyLength, setKeyLength] = useState(16);
  const [key1, setKey1] = useState('');
  const [key2, setKey2] = useState('');

  const submitHandler = async () => {
    await axios
      .post('/api/crypto/pbkdf2', { password, salt, iteration, keyLength })
      .then((res) => {
        setKey2(res.data.key);
      });

    const derivedKey = forge.util.bytesToHex(
      forge.pkcs5.pbkdf2(password, salt, iteration, keyLength)
    );

    setKey1(derivedKey);
  };

  const randomSalt = () => {
    setSalt(forge.util.bytesToHex(forge.random.getBytesSync(16)));
  };

  return (
    <Layout title="PBKDF2">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">
          PBKDF2 (패스워드 기반 키생성)
        </h1>

        <div className="mb-4">
          <p>
            사용자가 입력하는 패스워드를 직접 비밀키로 사용하는 것은 고정된 키를
            사용하게 되어 사전공격 등의 방법이 가능하므로 보안성에 문제가 많다.
            이를 해결하기 위하여 패스워드 기반 키생성함수(PBKDF2)를 이용하는데
            (1)사용자 입력의 패스워드, (2)랜덤한 salt값,
            (3)반복횟수(iteration)값을 이용하여 난수처럼 보이는 암호키를
            생성하여 사용한다. salt값과 반복횟수값은 공격자의 사전공격을 어렵게
            하는 중요한 요소이다.
          </p>
          <Image src={pbkdf2Pic} alt="pbkdf2" />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-3 font-bold">
            Input password
          </label>
          <input
            type="text"
            name="password"
            id="password"
            className="w-full bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="salt" className="mb-3 font-bold">
            Salt
          </label>
          <input
            type="text"
            name="salt"
            id="salt"
            className="w-full bg-gray-50"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={randomSalt}
          >
            Generate random salt
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="iteration" className="mb-3 font-bold">
            Iteration
          </label>
          <input
            type="number"
            name="iteration"
            id="iteration"
            className="w-full bg-gray-50"
            value={iteration}
            onChange={(e) => setIteration(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="keyLength" className="mb-3 font-bold">
            Key Length
          </label>
          <input
            type="number"
            name="keyLength"
            id="keyLength"
            className="w-full bg-gray-50"
            value={keyLength}
            onChange={(e) => setKeyLength(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={submitHandler}
          >
            Generate PBKDF2 key
          </button>
        </div>

        <div className="mb-4 overflow-x-auto">
          <h2 className="mb-3 font-bold">Result</h2>
          <div className="px-4 bg-slate-200">
            <p>Password: {password}</p>
            <p>Salt: {salt}</p>
            <p>Iteration: {iteration}</p>
            <p>Key length: {keyLength} bytes</p>
            <p className="overflow-x-auto text-red-700">
              Generated key (client-side): {key1} ({key1.length * 4} bits)
            </p>
            <p className="overflow-x-auto  text-blue-700">
              Generated key (server-side): {key2} ({key2.length * 4} bits)
            </p>
          </div>
        </div>
      </form>
    </Layout>
  );
}

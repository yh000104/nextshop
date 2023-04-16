import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Image from 'next/image';
import bcryptPic from '../../public/bcrypt.jpg';
import bcrypt from 'bcryptjs';
import axios from 'axios';

export default function PasswordHashScreen() {
  const [password, setPassword] = useState('supersecretpassword');
  const [hpassword, setHpassword] = useState('');
  const [password1, setPassword1] = useState('supersecretpassword');
  const [result, setResult] = useState(false);
  const [result1, setResult1] = useState(false);

  const submitHandler = async () => {
    let hash = bcrypt.hashSync(password, 8);
    setHpassword(hash);
  };

  const loginHandler = async () => {
    await axios
      .post('/api/crypto/passwordHash', { password, password1 })
      .then((res) => {
        setResult1(res.data.result);
      });

    const res = await bcrypt.compareSync(password1, hpassword);
    setResult(res);
  };

  return (
    <Layout title="PasswordHash">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">
          Password Hash Salting (패스워드 해시 저장)
        </h1>

        <p>
          사용자 등록시 사용자가 입력하는 패스워드를 서버에 그대로 저장하지 않고
          솔트를 추가하여 패스워드 해시를 계산하여 저장한다. 로그인시에는
          패스워드가 맞는지 검증할 수 있다.
        </p>

        <div className="mx-20">
          <Image src={bcryptPic} alt="password hash" />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="mb-3 font-bold">
            Password registration
          </label>
          <input
            type="text"
            name="password"
            id="password"
            className="w-full bg-gray-50"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={submitHandler}
          >
            Password Registration (패스워드 등록)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="hpassword" className="mb-3 font-bold">
            Hashed Password
          </label>
          <input
            type="text"
            name="hpassword"
            id="hpassword"
            className="w-full bg-gray-50"
            defaultValue={hpassword}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password1" className="mb-3 font-bold">
            Password login
          </label>
          <input
            type="text"
            name="password1"
            id="password1"
            className="w-full bg-gray-50"
            defaultValue={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={loginHandler}
          >
            Password Login (패스워드 로그인)
          </button>
        </div>

        <div className="mb-4 overflow-x-auto">
          <h2 className="mb-3 font-bold">Result</h2>
          <div className="px-4 bg-slate-200">
            <p>Registered password: {password}</p>
            <p>Login password: {password1}</p>
            <p className="text-red-700 font-bold">
              Login result (client-side):{' '}
              {result ? '로그인 성공' : '로그인 실패'}
            </p>
            <p className="text-red-700 font-bold">
              Login result (server-side):{' '}
              {result1 ? '로그인 성공' : '로그인 실패'}
            </p>
          </div>
        </div>
      </form>
    </Layout>
  );
}

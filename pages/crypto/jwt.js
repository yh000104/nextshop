import React, { useState } from 'react';
import Layout from '../../components/Layout';
import jwt from 'jsonwebtoken';
import Image from 'next/image';
import jwtPic from '../../public/jwt.jpg';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function JwtScreen() {
  const { data: session } = useSession();
  const userEmail = session?.user.email;

  const [username, setUsername] = useState(userEmail);
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState('');
  const [result, setResult] = useState('');

  const genJwt = async () => {
    await axios.post('/api/crypto/jwt', { username }).then((res) => {
      setToken(res.data.token);
      localStorage.setItem('jwt', res.data.token);
      let decoded = jwt.decode(res.data.token);
      setDecoded(JSON.stringify(decoded));
    });
  };

  const verifyJwt = async () => {
    await axios.post('/api/crypto/jwt-v', { token }).then((res) => {
      setResult(res.data.result);
    });
  };

  return (
    <Layout title="JWT">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">JSON Web Token (JWT)</h1>
        <p>
          JSON Web Tokens are an open, industry standard RFC 7519 method for
          representing claims securely between two parties.
        </p>

        <div className="mx-auto px-20">
          <Image src={jwtPic} alt="jwt" />
        </div>

        <div className="mb-4">
          <label htmlFor="input" className="mb-3 font-bold">
            Username
          </label>
          <input
            name="input"
            id="input"
            className="w-full bg-gray-50"
            autoFocus
            placeholder="텍스트를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={genJwt}
          >
            Issue JWT
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="jwt" className="mb-3 font-bold">
            JWT - server issued
          </label>
          <textarea
            name="jwt"
            id="jwt"
            cols="50"
            rows="3"
            className="w-full bg-gray-50"
            value={token}
            readOnly
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="jwt" className="mb-3 font-bold">
            JWT - client decoded, no verification
          </label>
          <textarea
            name="jwt"
            id="jwt"
            cols="50"
            rows="2"
            className="w-full bg-gray-50"
            value={decoded}
            readOnly
          ></textarea>
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={verifyJwt}
          >
            Verify JWT
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="jwt" className="mb-3 font-bold">
            Verified by server
          </label>
          <input
            name="jwt"
            id="jwt"
            className="w-full bg-gray-50"
            value={result ? 'valid token' : 'invalid'}
            readOnly
          ></input>
        </div>
      </form>
    </Layout>
  );
}

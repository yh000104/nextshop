import React, { useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';

export default function JwtStorageScreen() {
  const { data: session } = useSession();
  const userEmail = session?.user.email;

  const [username, setUsername] = useState(userEmail);
  const [jwtLocal, setJwtLocal] = useState('');
  const [jwtSession, setJwtSession] = useState('');
  const [jwtCookie, setJwtCookie] = useState('');

  const genJwt = async () => {
    await axios.post('/api/crypto/jwt-storage', { username }).then((res) => {
      const token = res.data.token;

      // 로컬스토리지에 저장
      localStorage.setItem('jwt', token);
      // 세션스토리지에 저장
      sessionStorage.setItem('jwt', token);
      // 쿠키에 저장
      Cookies.set('jwt', token);

      console.log('Local storage: ' + localStorage.getItem('jwt'));
      console.log('Session storage: ' + sessionStorage.getItem('jwt'));
      console.log('Cookie: ' + Cookies.get('jwt'));

      // HttpOnly 쿠키는 클라이언트에서 읽을 수 없음
      console.log('Secure Cookie: ' + Cookies.get('sToken'));

      // 로컬스토리지에서 읽어옴
      setJwtLocal(localStorage.getItem('jwt'));
      // 세션스토리지에서 읽어옴
      setJwtSession(sessionStorage.getItem('jwt'));
      // 쿠키에서 읽어옴
      setJwtCookie(Cookies.get('jwt'));
    });
  };

  return (
    <Layout title="JWT">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">JSON Web Token - Storage </h1>
        <p className="mb-4">
          <b>브라우저에서 사용할 수 있는 스토리지 종류</b> <br />
          LocalStorage - 지우기 전까지는 계속 저장됨. 브라우저가 읽고 쓰기
          가능함. <br />
          SessionStorage - 브라우저가 읽고 쓰기 가능함. 세션이 끝나면 자동으로
          지워짐. <br />
          Cookie - 쿠키에 저장된 정보는 서버에게 전송시 항상 자동 첨부됨. <br />
          HttpOnly Cookie - 서버가 저장하고 서버만 읽을 수 있는 쿠키.
          클라이언트에서는 접근 불가.
        </p>

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
            JWT - LocalStorage
          </label>
          <textarea
            name="jwt"
            id="jwt"
            cols="50"
            rows="3"
            className="w-full bg-gray-50"
            value={jwtLocal}
            readOnly
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="jwt" className="mb-3 font-bold">
            JWT - SessionStorage
          </label>
          <textarea
            name="jwt"
            id="jwt"
            cols="50"
            rows="3"
            className="w-full bg-gray-50"
            value={jwtSession}
            readOnly
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="jwt" className="mb-3 font-bold">
            JWT - Cookie
          </label>
          <textarea
            name="jwt"
            id="jwt"
            cols="50"
            rows="3"
            className="w-full bg-gray-50"
            value={jwtCookie}
            readOnly
          ></textarea>
        </div>
      </form>
    </Layout>
  );
}

import Link from 'next/link';
import Layout from '../../components/Layout';

export default function Crypto() {
  return (
    <Layout title="crypto">
      <h1 className="mb-4 text-2xl text-center">
        Crypto Test (암호 알고리즘 테스트)
      </h1>
      <div className="mx-auto max-w-screen-sm">
        <div className="button-link">
          <Link href="crypto/hash">
            <a className=" text-xl">Hash function - 해시함수 </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/hmac">
            <a className=" text-xl">
              Message Authentication Code (HMAC) - 메시지인증코드
            </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/pbkdf2">
            <a className=" text-xl">
              Password-based key derivation function - 패스워드기반키생성
            </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/passwordHash">
            <a className=" text-xl">Password Hash Salting - 패스워드 해시 </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/aes">
            <a className=" text-xl">AES encryption - 대칭키 암호 </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/rsaenc">
            <a className=" text-xl">RSA encryption - 공개키 암호 </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/rsasig">
            <a className=" text-xl">RSA signature - 전자서명 </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/jwt">
            <a className=" text-xl">JSON Web Token (JWT) </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/cert">
            <a className=" text-xl">Certificate - 인증서 </a>
          </Link>
        </div>

        <div className="button-link">
          <Link href="crypto/jwt-storage">
            <a className=" text-xl">JWT - Storage </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

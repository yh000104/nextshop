import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Image from 'next/image';
import x509Pic from '../../public/x509.jpg';
import certPic from '../../public/cert.jpg';
import forge from 'node-forge';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const rsa = forge.pki.rsa;
const pki = forge.pki;

export default function CertScreen() {
  const { data: session } = useSession();
  const userEmail = session?.user.email;
  const lengths = [1024, 2048, 3072];

  const [keyLength, setKeyLength] = useState(1024);
  // eslint-disable-next-line no-unused-vars
  const [publicKey, setPublicKey] = useState('');
  const [publicKeyPem, setPublicKeyPem] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [privateKey, setPrivateKey] = useState('');
  const [privateKeyPem, setPrivateKeyPem] = useState('');

  const [serial, setSerial] = useState(101);
  const [cn, setCn] = useState(userEmail);
  const [country, setCountry] = useState('KR');
  const [state, setState] = useState('Gyeonggi-do');
  const [locality, setLocality] = useState('Goyang-si');
  const [org, setOrg] = useState('Joongbu Univ.');
  const [orgUnit, setOrgUnit] = useState('Dept. of Information Security');
  const [certPem, setCertPem] = useState('');
  const [caCertPem, setCaCertPem] = useState('');
  const [result, setResult] = useState(false);

  const keyGen = () => {
    const keypair = rsa.generateKeyPair({ bits: keyLength, e: 0x10001 });
    const pbk = keypair.publicKey;
    const prk = keypair.privateKey;
    const publicKeyPem = pki.publicKeyToPem(pbk);
    const privateKeyPem = pki.privateKeyToPem(prk);

    setPublicKey(pbk);
    setPublicKeyPem(publicKeyPem);
    setPrivateKey(prk);
    setPrivateKeyPem(privateKeyPem);
    localStorage.setItem('privateKeyPem', privateKeyPem);
  };

  const genCert = async () => {
    // 서버에 요청하여 서버가 발급하는 인증서를 받아옴
    await axios
      .post('/api/crypto/cert', {
        serial,
        cn,
        country,
        state,
        locality,
        org,
        orgUnit,
        publicKeyPem,
      })
      .then((res) => {
        let certPem = res.data.certPem;
        let caCertPem = res.data.caCertPem;
        setCertPem(certPem);
        setCaCertPem(caCertPem);
        localStorage.setItem('certPem', certPem);
        localStorage.setItem('caCertPem', caCertPem);
      });
  };

  const verifyCert = async () => {
    let certPem1 = localStorage.getItem('certPem');
    let caCertPem1 = localStorage.getItem('caCertPem');

    let cert = pki.certificateFromPem(certPem1);
    let caCert = pki.certificateFromPem(caCertPem1);
    let result = caCert.verify(cert);
    setResult(result);
  };

  return (
    <Layout title="Cert">
      <form className="mx-auto max-w-screen-lg">
        <h1 className="text-3xl mb-4 font-bold">
          X.509 Certificate (인증서 발급 및 활용)
        </h1>

        <div className="mb-4 ">
          <p>
            인증서란 개인의 공개키와 개인의 인증정보에 대해 인증기관이 서명하여
            발급하는 문서이다.
          </p>
          <div className="mb-4 flex flex-row">
            <div className="basis-1/2 mx-2">
              <Image
                src={x509Pic}
                layout="responsive"
                alt="X.509 certificate"
              />
            </div>
            <div className="basis-1/2 mx-2 my-auto">
              <Image
                src={certPic}
                layout="responsive"
                alt="X.509 certificate"
              />
            </div>
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
                defaultValue={1024}
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

        <div className="bg-yellow-100 p-3">
          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="serial" className=" font-bold">
                Serial Number
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="number"
                name="serial"
                id="serial"
                className="w-full bg-gray-50"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="cn" className=" font-bold">
                Common Name (이름)
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="text"
                name="cn"
                id="cn"
                className="w-full bg-gray-50"
                value={cn}
                onChange={(e) => setCn(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="country" className=" font-bold">
                Country (국가)
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="text"
                name="country"
                id="country"
                className="w-full bg-gray-50"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="state" className=" font-bold">
                State (광역시도)
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="text"
                name="state"
                id="state"
                className="w-full bg-gray-50"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="locality" className=" font-bold">
                Locality (시군)
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="text"
                name="locality"
                id="locality"
                className="w-full bg-gray-50"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="org" className=" font-bold">
                Organization (기관)
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="text"
                name="org"
                id="org"
                className="w-full bg-gray-50"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-row mb-2">
            <div className="basis-1/2">
              <label htmlFor="orgUnit" className="mb-3 font-bold">
                Organizational Unit (부서)
              </label>
            </div>
            <div className="basis-1/2">
              <input
                type="text"
                name="orgUnit"
                id="orgUnit"
                className="w-full bg-gray-50"
                value={orgUnit}
                onChange={(e) => setOrgUnit(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={genCert}
          >
            Issue certificate
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="certPem" className="mb-3 font-bold">
            User Certificate
          </label>
          <textarea
            type="text"
            name="certPem"
            id="certPem"
            cols="50"
            rows="6"
            className="w-full bg-gray-50"
            value={certPem}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="certPem" className="mb-3 font-bold">
            CA Certificate
          </label>
          <textarea
            type="text"
            name="certPem"
            id="certPem"
            cols="50"
            rows="6"
            className="w-full bg-gray-50"
            value={caCertPem}
            readOnly
          />
        </div>

        <div className="mb-4">
          <button
            className="primary-button w-full"
            type="button"
            onClick={verifyCert}
          >
            Verification (인증서 유효성 검증)
          </button>
        </div>

        <div className="mb-4">
          <label htmlFor="verifyCert" className="mb-3 font-bold">
            Result
          </label>
          <input
            type="text"
            name="verifyCert"
            id="verifyCert"
            className="w-full bg-gray-50"
            value={result}
            readOnly
          />
        </div>
      </form>
    </Layout>
  );
}

import { getSession } from 'next-auth/react'
import CryptoLog from '../../../models/CryptoLog'
import { computeHmac } from '../../../utils/crypto-function'
import db from '../../../utils/db'

export default async function handler(req, res) {
  const { algorithm, inputText, secret } = req.body
  let hmacValue = computeHmac(algorithm, secret, inputText)

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).send({ message: 'signin required' })
  }
  const { user } = session
  const email = user.email

  const requestString = JSON.stringify(req.body)
  const resultString = JSON.stringify({ hmacValue })

  const newCryptoLog = new CryptoLog({
    email,
    service: 'HMAC',
    request: requestString,
    result: resultString,
  })

  await db.connect()
  await newCryptoLog.save()
  await db.disconnect()

  res.status(200).json({ hmacValue })
}

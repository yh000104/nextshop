import { getSession } from 'next-auth/react'
import CryptoLog from '../../../models/CryptoLog'
import { computeHash } from '../../../utils/crypto-function'
import db from '../../../utils/db'

export default async function handler(req, res) {
  const { algorithm, inputText } = req.body
  let hashValue = computeHash(algorithm, inputText)

  const session = await getSession({ req })
  if (!session) {
    return res.status(401).send({ message: 'signin required' })
  }
  const { user } = session
  const email = user.email

  const requestString = JSON.stringify(req.body)
  const resultString = JSON.stringify({ hashValue })

  const newCryptoLog = new CryptoLog({
    email,
    service: 'Hash',
    request: requestString,
    result: resultString,
  })

  await db.connect()
  await newCryptoLog.save()
  await db.disconnect()

  res.status(200).json({ hashValue })
}

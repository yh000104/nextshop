import mongoose from 'mongoose';

const cryptoLogSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    service: { type: String, required: true }, // Hash, HMAC,
    request: { type: String, required: true },
    result: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const CryptoLog =
  mongoose.models.CryptoLog || mongoose.model('CryptoLog', cryptoLogSchema);
export default CryptoLog;

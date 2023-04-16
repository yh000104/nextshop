import mongoose from 'mongoose';

const loginLogSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const LoginLog =
  mongoose.models.LoginLog || mongoose.model('LoginLog', loginLogSchema);
export default LoginLog;

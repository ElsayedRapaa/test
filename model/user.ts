import mongoose, { Schema, Document } from "mongoose";

export interface Wallet {
  currency: string;
  balance: number;
  address: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerify: boolean;
  isAcceptingMessage: boolean;
  wallets: Wallet[];
  transactionHistory: Transaction[];
  binanceApiKey: string;
  binanceApiSecret: string;
}

const WalletSchema: Schema<Wallet> = new Schema({
  currency: { type: String, required: true },
  balance: { type: Number, default: 0 },
  address: { type: String, required: true },
});

const TransactionSchema: Schema<Transaction> = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required!"],
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required!"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify code expiry is required!"],
  },
  isVerify: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  wallets: [WalletSchema],
  transactionHistory: [TransactionSchema],
  binanceApiKey: {
    type: String,
    required: [true, "Binance API key is required!"],
  },
  binanceApiSecret: {
    type: String,
    required: [true, "Binance API secret is required!"],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

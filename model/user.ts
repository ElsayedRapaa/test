import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

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
  role: "admin" | "user";
  address: string;
  pass: string;
  isFirstLogin: boolean;
  hasReceivedPrize: boolean;
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
  transactionHistory: { type: [TransactionSchema], default: [] },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  address: { type: String, required: false, default: "" },
  pass: { type: String, required: false, default: "" },
  isFirstLogin: {
    type: Boolean,
    default: true,
  },
  hasReceivedPrize: {
    type: Boolean,
    default: true,
  },
});

UserSchema.pre("save", function (next) {
  if (this.isNew) {
    const currencies = ["BTC", "ETH", "BNB", "USDT"];
    const generatedWallets = currencies.map((currency) => ({
      currency,
      address: crypto.randomBytes(20).toString("hex"),
      balance: 0,
    }));
    this.wallets = generatedWallets;
  }
  next();
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

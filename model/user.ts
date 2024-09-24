import mongoose, { Schema, Document } from "mongoose";
// import crypto from "crypto";

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

const fixedAddresses = [
  { currency: "BTC", address: "bc1qjp722ft9tr4jzewh3v9c64j3m97rcku7culdn0" },
  { currency: "ETH", address: "0xe5999D6E15FCaE2648e8ED38abf5fFE0a38b140a" },
  { currency: "BNB", address: "0xe5999D6E15FCaE2648e8ED38abf5fFE0a38b140a" },
  { currency: "USDT", address: "0xe5999D6E15FCaE2648e8ED38abf5fFE0a38b140a" },
  { currency: "GBP", address: "0x0676C9E3F01c62B8031e727e40bDc1381484A869" },
];

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
});

UserSchema.pre("save", function (next) {
  // if (this.isNew) {
  //   const currencies = ["BTC", "ETH", "BNB", "USDT", "GBP"];
  //   const generatedWallets = currencies.map((currency) => ({
  //     currency,
  //     address: crypto.randomBytes(20).toString("hex"),
  //     balance: 0,
  //   }));
  //   this.wallets = generatedWallets;
  // }
  if (this.isNew) {
    this.wallets = fixedAddresses.map(({ currency, address }) => ({
      currency,
      address,
      balance: 0,
    }));
  }
  next();
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;

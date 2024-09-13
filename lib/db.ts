import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function db(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const database = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = database.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection Failed", error);
    process.exit(1);
  }
}

export default db;

import Binance, { OrderType } from "binance-api-node";

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY as string,
  apiSecret: process.env.BINANCE_API_SECRET as string,
});

type AccountInfo = Awaited<ReturnType<typeof client.accountInfo>>;
type Order = Awaited<ReturnType<typeof client.order>>;
type WithdrawResult = Awaited<ReturnType<typeof client.withdraw>>;

export const getAccountInfo = async (): Promise<AccountInfo> => {
  try {
    const accountInfo = await client.accountInfo();
    return accountInfo;
  } catch (error) {
    console.error("Error fetching account info:", error);
    throw error;
  }
};

export const placeOrder = async (
  symbol: string,
  quantity: number,
  price: number
): Promise<Order> => {
  try {
    const order = await client.order({
      symbol,
      side: "BUY",
      quantity: quantity.toString(),
      price: price.toString(),
      type: OrderType.LIMIT,
      timeInForce: "GTC",
    });
    return order;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

export const transferFunds = async (
  coin: string,
  amount: number,
  address: string,
  network?: string
): Promise<WithdrawResult> => {
  try {
    const result = await client.withdraw({
      coin,
      address,
      amount,
      network,
    });
    return result;
  } catch (error) {
    console.error("Error transferring funds:", error);
    throw error;
  }
};

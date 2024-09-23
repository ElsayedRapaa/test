/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Binance, { OrderType } from "binance-api-node";

export enum MyOrderType {
  LIMIT = "LIMIT",
  MARKET = "MARKET",
  STOP_LOSS_LIMIT = "STOP_LOSS_LIMIT",
  TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
}

const client = Binance({
  apiKey: process.env.BINANCE_API_KEY as string,
  apiSecret: process.env.BINANCE_API_SECRET as string,
});

export const placeOrder = async (
  symbol: string,
  quantity: number,
  price: number,
  orderType: MyOrderType
): Promise<any> => {
  try {
    const order = await client.order({
      symbol,
      side: "BUY",
      quantity: quantity.toString(),
      price: price.toString(),
      // @ts-ignore
      type: OrderType.LIMIT,
      timeInForce: "GTC",
    });
    return order;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

import { createContext } from "react";

export const CartSumContext = createContext({
  sum: 0,
  setSum: (newSum: number) => {console.log(newSum)}
});
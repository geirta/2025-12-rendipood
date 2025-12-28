import { useState, type ReactNode } from "react";
import { CartSumContext } from "./CartSumContext";
import type { CartProduct } from "../model/CartProduct";


export const CartSumContextProvider = ({children}: {children: ReactNode}) => {

  const [sum, setSum] = useState(calculateCartSum());

  function calculateCartSum() {
    const cart: CartProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");
    let sum = 0;
    cart.forEach(cp => sum += cp.product.price * cp.quantity);
    return sum;
  }

  return (
    <CartSumContext.Provider value={{sum, setSum}}>
      {children}
    </CartSumContext.Provider>
  )

}
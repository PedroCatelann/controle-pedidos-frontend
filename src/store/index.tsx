"use client";
import type { AppProps } from "next/app";
import { counterStore } from "./CounterStore";
import { createContext, useContext } from "react";

const StoreContext = createContext({ counterStore });

export const useStores = () => useContext(StoreContext);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StoreContext.Provider value={{ counterStore }}>
      <Component {...pageProps} />
    </StoreContext.Provider>
  );
}

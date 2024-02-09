import React, { createContext, useContext, useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";

// Create the context with default values
const Web3Context = createContext<any>({
  connect: () => {},
  disconnect: () => {},
  account: undefined,
  connected: false,
});

// Custom hook to use the Web3 context
export const useMetamask = () => useContext(Web3Context);

// Provider component to wrap around components that need access to the context
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string>();
  const { sdk, connected, connecting, provider, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      console.log(accounts);
      // @ts-ignore
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const disconnect = () => {
    try {
      sdk?.disconnect();
    } catch (err) {
      console.warn(`failed to disconnect..`, err);
    }
  };

  useEffect(() => {
    if (connected && !account) {
      // reconnect to get the accounts
      connect();
    }
  }, [connected]);

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        account,
        connected,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

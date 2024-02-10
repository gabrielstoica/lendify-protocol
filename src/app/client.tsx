"use client";

import { Web3Provider } from "@/context/MetamaskContext";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { FC, PropsWithChildren } from "react";

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "LendifyProtocol App",
          url: window.location.host,
        },
        // Use Infura API to make read-only JSON-RPC requests
        // To secure this API Key, see https://docs.infura.io/dashboard/secure-an-api
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </MetaMaskProvider>
  );
};

export default ClientLayout;

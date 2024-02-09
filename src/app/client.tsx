"use client";

import { Web3Provider } from "@/context/MetamaskContext";
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";
import { FC, PropsWithChildren, useState } from "react";

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "NFT-Lending App",
          url: window.location.host,
        },
        // Use Infura API to make read-only JSON-RPC requests
        // To secure this API Key, see https://docs.infura.io/dashboard/secure-an-api
        infuraAPIKey: "3d412e571202496ba31cbce9be31a649",
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </MetaMaskProvider>
  );
};

export default ClientLayout;

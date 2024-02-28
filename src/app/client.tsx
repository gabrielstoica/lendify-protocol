"use client";

import { Web3Provider } from "@/context/MetamaskContext";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { FC, PropsWithChildren } from "react";

const ClientLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        // Create a trustworthy user experience when connecting your dapp to MetaMask Mobile
        // See https://docs.metamask.io/wallet/reference/sdk-js-options/#dappmetadata
        dappMetadata: {
          name: "LendifyProtocol App",
          url: "https://lendifyprotocol.com",
          base64Icon: "./favicon.ico",
        },
        checkInstallationImmediately: false,
        // Use Infura API to make read-only JSON-RPC requests
        // Important! Vulnerable to exposure, use allowlist to protect against this vulnerability
        // To secure this API Key, see https://docs.infura.io/dashboard/secure-an-api
        infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
        // See more config options https://docs.metamask.io/wallet/reference/sdk-js-options/
      }}
    >
      <Web3Provider>{children}</Web3Provider>
    </MetaMaskProvider>
  );
};

export default ClientLayout;

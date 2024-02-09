import React, { createContext, useContext, useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";

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
  const [tokens, setTokens] = useState<Array<object>>();
  const { sdk, connected, connecting, provider, chainId, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
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

  const getUserNFTs = async () => {
    // @ts-ignore
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner(account);

    // Set-up the BoredApeClub ERC721 smart contract deployed on Linea
    // For more informations see https://www.bilinear.io/collections/linea/0x55de1ef7868bd0ad56e7709403af1860f4a823a9
    const abi = [
      "function tokenURI(uint256 tokenId) public view returns (string memory)",
      "function tokensURI() public view returns (string)",
    ];
    const boredApeClubContract = new ethers.Contract("0x55de1ef7868bd0ad56e7709403af1860f4a823a9", abi, signer);

    // Retrieve the baseURI of the collection
    let baseURI = await boredApeClubContract.tokensURI();

    // Use a dedicated Infura IPFS Gateway to retrieve the IPFS content
    // Note: This should be replaced with the customer's dedicated IPFS gateway
    const dedicatedIpfsGateway = process.env.NEXT_PUBLIC_INFURA_DEDICATED_IPFS_GATEWAY || "ipfs.io/ipfs/";
    baseURI = dedicatedIpfsGateway.concat(baseURI);

    // Get the first 3 tokens to showcase to the user how to retrieve the NFTs
    const tokens = await Promise.all(
      Array.from({ length: 3 }, async (_, index) => {
        const tokenURI = baseURI.concat("/", index + 1, ".json");
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        let token = {
          ...metadata,
          image: metadata.image.replace("ipfs://", dedicatedIpfsGateway),
        };
        return token;
      })
    );

    setTokens(tokens);
  };

  useEffect(() => {
    if (connected && account) {
      getUserNFTs();
    }
  }, [connected, account]);

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        account,
        connected,
        tokens,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

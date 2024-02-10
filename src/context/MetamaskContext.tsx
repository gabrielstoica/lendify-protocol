import React, { createContext, useContext, useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { Contract, ethers } from "ethers";

// Create the context with default values
const Web3Context = createContext<any>({
  connect: () => {},
  disconnect: () => {},
  account: undefined,
  connected: false,
  tokens: [],
  borrow: () => {},
  repayLoan: () => {},
});

// Custom hook to use the Web3 context
export const useMetamask = () => useContext(Web3Context);

// Provider component to wrap around components that need access to the context
export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [tokens, setTokens] = useState<Array<object>>();
  const [response, setResponse] = useState<unknown>("");
  const { sdk, connected, connecting, provider, chainId, account } = useSDK();

  // Helper methods

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

  const changeNetwork = async (hexChainId: string) => {
    console.log(`switching to network chainId=${hexChainId}`);
    try {
      const response = await provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId }], // chainId must be in hexadecimal numbers
      });
      console.log(`response`, response);
    } catch (err) {
      console.error(err);
    }
  };

  const connectAndSign = async () => {
    try {
      const signResult = await sdk?.connectAndSign({
        msg: "Welcome to LendifyProtocol!\nPlease sign this message to access the platform.",
      });
      setResponse(signResult);
    } catch (err) {
      console.warn(`failed to connect..`, err);
    }
  };

  const readOnlyCalls = async () => {
    if (!sdk?.hasReadOnlyRPCCalls() && !provider) {
      setResponse("readOnlyCalls are not set and provider is not set. Please set your infuraAPIKey in the SDK Options");
      return;
    }
    try {
      const result = await provider?.request({
        method: "eth_blockNumber",
        params: [],
      });
      const gotFrom = sdk?.hasReadOnlyRPCCalls() ? "infura" : "MetaMask provider";
      setResponse(`(${gotFrom}) ${result}`);
    } catch (e) {
      console.log(`error getting the blockNumber`, e);
      setResponse("error getting the blockNumber");
    }
  };

  // Platform related methods

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
    const boredApeClubContractAddress: string = "0x55de1ef7868bd0ad56e7709403af1860f4a823a9";
    const boredApeClubContract: Contract = new ethers.Contract(boredApeClubContractAddress, abi, signer);

    // Retrieve the baseURI of the collection
    let baseURI: string = await boredApeClubContract.tokensURI();

    // Use a dedicated Infura IPFS Gateway to retrieve the IPFS content
    // Note: This should be replaced with the customer's dedicated IPFS gateway
    const dedicatedIpfsGateway = process.env.NEXT_PUBLIC_INFURA_DEDICATED_IPFS_GATEWAY || "ipfs.io/ipfs/";
    baseURI = dedicatedIpfsGateway.concat(baseURI);

    // Get the first 3 tokens to showcase to the user how to retrieve the NFTs
    const tokens: Array<object> = await Promise.all(
      Array.from({ length: 3 }, async (_, index: number) => {
        const tokenURI = baseURI.concat("/", (index + 1).toString(), ".json");
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        let token = {
          ...metadata,
          id: index + 1,
          image: metadata.image.replace("ipfs://", dedicatedIpfsGateway),
          contractAddress: boredApeClubContractAddress,
        };
        return token;
      })
    );

    setTokens(tokens);
  };

  const borrow = async (contractAddress: string, tokenId: number) => {
    // @ts-ignore
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner(account);

    // Set-up the LendifyProtocol contract ABI deployed on Linea
    const abi = ["function borrow(address contractAddress, uint256 tokenId) external"];
    const lendifyProtocolContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_LENDIFYPROTOCOL_CONTRACT_ADDRESS!,
      abi,
      signer
    );

    const transaction = await lendifyProtocolContract.borrow(contractAddress, tokenId);
    await transaction.wait();
  };

  const repayLoan = async (contractAddress: string, tokenId: number) => {
    // @ts-ignore
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner(account);

    // Set-up the LendifyProtocol contract ABI deployed on Linea
    const abi = [
      "function repayLoan(address contractAddress, uint256 tokenId) external",
      "function fixedLoan() public view returns (uint256)",
    ];
    const lendifyProtocolContract = new ethers.Contract(
      process.env.NEXT_PUBLIC_LENDIFYPROTOCOL_CONTRACT_ADDRESS!,
      abi,
      signer
    );

    // Set-up the USDC contract to approve the loan amount to be transferred by the LendifyProtocol
    // Reference: https://lineascan.build/token/0x176211869cA2b568f2A7D4EE941E073a821EE1ff
    const abiUSDC = ["function approve(address spender, uint256 value) external returns (bool)"];
    const USDCContract = new ethers.Contract("0x176211869cA2b568f2A7D4EE941E073a821EE1ff", abiUSDC, signer);

    // Get the fixed loan amount from required by the LendifyProtocol
    const fixedLoan = await lendifyProtocolContract.fixedLoan();

    // Approve the LendifyProtocol to transfer the fixed loan from the borrower
    let transaction = await USDCContract.approve(process.env.NEXT_PUBLIC_LENDIFYPROTOCOL_CONTRACT_ADDRESS, fixedLoan);
    await transaction.wait();

    // Finally, repay the loan and get back the NFT
    transaction = await lendifyProtocolContract.repayLoan(contractAddress, tokenId);
    await transaction.wait();
  };

  useEffect(() => {
    if (connected && account) {
      getUserNFTs();
    }
  }, [connected, account]);

  // Enforce Linea Mainnet for our use case
  useEffect(() => {
    if (chainId && chainId !== "0xe708") {
      changeNetwork("0xe708");
    }
  }, [chainId]);

  return (
    <Web3Context.Provider
      value={{
        connect,
        disconnect,
        account,
        connected,
        tokens,
        borrow,
        repayLoan,
        connecting,
        connectAndSign,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

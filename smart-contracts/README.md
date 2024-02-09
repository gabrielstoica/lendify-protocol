## Foundry-based LendifyProtocol smart contracts

A simple lending & borrowing smart contract where end-users can collateralize an NFT to borrow a fixed USDC loan amount.

## Usage

### Install dependencies

```
forge install
```

### Deploy and verify contracts on Linea

Create a `.env` file using the `.env.example` file provided in this folder and add your private key. Make sure to add a `0x` in front of your key to convert it to a hex.

Note: To deploy on either Linea Mainnet or Linea Goerli testnet, you will need an `Infura API Key` to access the RPC endpoints. Follow [this link](https://www.infura.io/networks/ethereum/linea) to get an API key and add assign it to the `INFURA_API_KEY` variable in the `.env` file.

Similarly, to verify the `LendifyProtocol` smart contract on `Lineascan`, you need an API key. You can get an API key from [here](https://lineascan.build/) - for both Linea Mainnet and Goerli testnet by creating an account. Once you have it, assign it to the `LINEA_EXPLORER_API_KEY` variable in the `.env` file.

```shell
$ forge script script/Deploy.s.sol --broadcast --verify --rpc-url linea-testnet
```

### Build and Test

```
forge build
forge test
```

It's highly recommended to properly test your smart contracts before going live. By using the [Diligence suite](https://consensys.io/diligence/), you're ensuring the highest level of security throughout the development and deployment processes. The suite is meticulously designed to mitigate risks, conduct thorough audits, and uphold industry best practices, providing you with a robust foundation for your blockchain projects:

- [Scribble](https://github.com/Consensys/scribble) - a Solidity runtime verification tool for property based testing
- [Mythril](https://github.com/Consensys/mythril) - a security analysis tool for EVM bytecode.
- [Solidity Metrics](https://github.com/ConsenSys/vscode-solidity-metrics) - generate Source Code Metrics, Complexity and Risk profile reports for projects written in Solidity.

```
forge test
```

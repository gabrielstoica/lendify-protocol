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

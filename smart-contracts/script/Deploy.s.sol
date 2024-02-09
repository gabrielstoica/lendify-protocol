// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {BaseScript} from "./Base.s.sol";
import {LendifyProtocol} from "src/LendifyProtocol.sol";

/// @notice Deploys the LendifyProtocol smart contract
contract DeployLendifyProtocol is BaseScript {
    function run() public broadcast returns (LendifyProtocol lendifyProtocol) {
        // Use the address of the USDC contract deployed on Linea Mainnet
        // Reference: https://lineascan.build/token/0x176211869cA2b568f2A7D4EE941E073a821EE1ff
        address USDC = address(0x176211869cA2b568f2A7D4EE941E073a821EE1ff);
        uint256 fixedLoan = 5 ether / 10 ** 12;

        lendifyProtocol = new LendifyProtocol(USDC, fixedLoan);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract Events {
    /// @notice Emitted when a borrower collateralizes their NFT to borrow a fixed amount of USDC
    event Borrowed(
        address indexed borrower,
        address indexed contractAddress,
        uint256 indexed tokenId
    );

    /// @notice Emitted when a borrower repays the loan
    event LoanRepayed(
        address indexed borrower,
        address indexed contractAddress,
        uint256 indexed tokenId
    );
}

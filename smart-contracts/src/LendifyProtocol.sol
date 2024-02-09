// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @notice Simple contract that manages NFT lending and borrowing - it distributes a fixed amount
/// of USDC once an NFT is deposited into the contract
///
/// Note: This is not a production-ready contract!
///
/// In the real world, a proper Price Feed should be used to retrieve the NFT floor price, see https://docs.chain.link/data-feeds/nft-floor-price/
contract LendifyProtocol {
    /// @dev Use a fixed loan amount to lend to the borrowers
    uint256 public fixedLoan;

    /// @dev USDC contract address - note: USDC contract address has 6 decimals
    address public immutable USDC;

    /// @dev Maps a token ID to its owner based on its contract address
    mapping(address contractAddress => mapping(uint256 tokenId => address)) vault;

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

    /// @notice Thrown when the borrower is not the owner of the ERC721 token
    error IncorrectOwner();

    /// @notice Thrown when the protocol lacks sufficient USDC funds to fulfill borrower payments
    error InsufficientFundsToLend();

    constructor(address _USDC, uint256 _fixedLoan) {
        USDC = _USDC;
        fixedLoan = _fixedLoan;
    }

    /// @notice Lends a fixed amount of USDC in exchange for depositing an ERC721 token
    function borrow(address contractAddress, uint256 tokenId) external {
        // Checks: the available USDC amount to lend to the borrower
        // this is also checked inside the `safeTransferFrom` but we want to throw a custom error
        if (IERC20(USDC).balanceOf(address(this)) < fixedLoan)
            revert InsufficientFundsToLend();

        // Checks: ensure the caller owns the NFT
        if (msg.sender != IERC721(contractAddress).ownerOf(tokenId))
            revert IncorrectOwner();

        // Effects: map the NFT to the borrower
        vault[contractAddress][tokenId] = msg.sender;

        // Interactions: transfer the NFT to the protocol
        IERC721(contractAddress).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        // Interactions: distribute the loan to the borrower
        IERC20(USDC).transferFrom(address(this), msg.sender, fixedLoan);

        // Emit the borrowed
        emit Borrowed(msg.sender, contractAddress, tokenId);
    }

    /// @notice Repays the loan and receives back the collateralized ERC721 token
    function repayLoan(address contractAddress, uint256 tokenId) external {
        // Checks: ensure the caller is the real NFT owner
        if (vault[contractAddress][tokenId] != msg.sender)
            revert IncorrectOwner();

        // Effects: reset the vault state
        vault[contractAddress][tokenId] = address(0);

        // Interactions: repay the loan
        IERC20(USDC).transferFrom(msg.sender, address(this), fixedLoan);
    }
}

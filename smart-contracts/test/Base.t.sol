// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Events} from "./utils/Events.sol";
import {Users} from "./utils/Types.sol";
import {LendifyProtocol} from "src/LendifyProtocol.sol";
import "forge-std/Test.sol";

abstract contract Base_Test is Test, Events {
    /*//////////////////////////////////////////////////////////////////////////
                                     VARIABLES
    //////////////////////////////////////////////////////////////////////////*/

    Users internal users;

    /*//////////////////////////////////////////////////////////////////////////
                                   TEST CONTRACTS
    //////////////////////////////////////////////////////////////////////////*/

    LendifyProtocol internal lendifyProtocol;

    /*//////////////////////////////////////////////////////////////////////////
                                  SET-UP FUNCTION
    //////////////////////////////////////////////////////////////////////////*/

    function setUp() public virtual {
        users = Users({
            admin: createUser("admin"),
            borrower: createUser("borrower")
        });
    }

    /*//////////////////////////////////////////////////////////////////////////
                            DEPLOYMENT-RELATED FUNCTIONS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Deploys the LendifyProtocol
    function deployLendifyProtocol() internal returns (LendifyProtocol) {
        // Use the address of the USDC contract deployed on Linea Mainnet
        // Reference: https://lineascan.build/token/0x176211869cA2b568f2A7D4EE941E073a821EE1ff
        address USDC = address(0x176211869cA2b568f2A7D4EE941E073a821EE1ff);
        uint256 fixedLoan = 5 ether / 10 ** 12;

        LendifyProtocol protocol = new LendifyProtocol(USDC, fixedLoan);
        return protocol;
    }

    /*//////////////////////////////////////////////////////////////////////////
                                    OTHER HELPERS
    //////////////////////////////////////////////////////////////////////////*/

    /// @dev Generates a user, labels its address, and funds it with test assets
    function createUser(string memory name) internal returns (address payable) {
        address payable user = payable(makeAddr(name));
        vm.deal({account: user, newBalance: 100 ether});

        return user;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Base_Test} from "./Base.t.sol";

contract Borrow_Test is Base_Test {
    function setUp() public virtual override {
        Base_Test.setUp();

        // Make the Admin the default caller in this test suite
        vm.startPrank({msgSender: users.admin});

        // Deploy DigitalEAC contract
        lendifyProtocol = deployLendifyProtocol();

        // Stop the active Admin prank
        vm.stopPrank();
    }

    function test_Borrow() external {
        // @todo add borrow test logic
    }
}

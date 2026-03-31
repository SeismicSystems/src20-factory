// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {SRC20Factory} from "../src/SRC20Factory.sol";

contract DeployScript is Script {
    function run() public {
        vm.startBroadcast();
        SRC20Factory factory = new SRC20Factory();
        vm.stopBroadcast();

        console.log("SRC20Factory deployed at:", address(factory));
    }
}

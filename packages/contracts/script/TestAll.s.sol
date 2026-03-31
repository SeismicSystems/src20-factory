// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import {SRC20Factory} from "../src/SRC20Factory.sol";
import {SRC20Token} from "../src/SRC20Token.sol";

contract TestAllScript is Script {
    address constant FACTORY = 0x87F850cbC2cFfac086F20d0d7307E12d06fA2127;
    address constant RECIPIENT = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function run() public {
        vm.startBroadcast();

        SRC20Factory factory = SRC20Factory(FACTORY);

        // ============ FACTORY METHODS ============

        // 1. createToken
        console.log("--- createToken ---");
        address tokenAddr = factory.createToken(
            "TestToken", "TT", 18, suint256(1000 ether)
        );
        console.log("Token deployed at:", tokenAddr);

        // 2. getTokenCount
        console.log("--- getTokenCount ---");
        uint256 count = factory.getTokenCount();
        console.log("Token count:", count);

        // 3. tokens(index)
        console.log("--- tokens(0) ---");
        address firstToken = factory.tokens(0);
        console.log("First token:", firstToken);

        // ============ TOKEN READ METHODS ============
        SRC20Token token = SRC20Token(tokenAddr);

        console.log("--- name ---");
        console.log("Name:", token.name());

        console.log("--- symbol ---");
        console.log("Symbol:", token.symbol());

        console.log("--- decimals ---");
        console.log("Decimals:", uint256(token.decimals()));

        console.log("--- owner ---");
        console.log("Owner:", token.owner());

        console.log("--- totalSupply ---");
        console.log("Total supply:", token.totalSupply());

        // ============ SHIELDED WRITES ============

        // 4. transfer
        console.log("--- transfer ---");
        token.transfer(RECIPIENT, suint256(100 ether));
        console.log("Transferred 100 tokens to", RECIPIENT);

        // 5. Check balance after transfer
        console.log("--- balance (sender) ---");
        uint256 bal = token.balance();
        console.log("Sender balance:", bal);

        // 6. approve
        console.log("--- approve ---");
        token.approve(RECIPIENT, suint256(50 ether));
        console.log("Approved 50 tokens for", RECIPIENT);

        // 7. allowance
        console.log("--- allowance ---");
        uint256 allow = token.allowance(RECIPIENT);
        console.log("Allowance to RECIPIENT:", allow);

        // 8. mint (owner-only)
        console.log("--- mint ---");
        token.mint(msg.sender, suint256(500 ether));
        console.log("Minted 500 tokens to sender");

        // 9. burn (owner-only)
        console.log("--- burn ---");
        token.burn(msg.sender, suint256(200 ether));
        console.log("Burned 200 tokens from sender");

        // 10. Final totalSupply check
        console.log("--- final totalSupply ---");
        console.log("Total supply:", token.totalSupply());

        // 11. Final balance
        console.log("--- final balance ---");
        console.log("Sender balance:", token.balance());

        // 12. nonces
        console.log("--- nonces ---");
        console.log("Nonces:", token.nonces(msg.sender));

        vm.stopBroadcast();
    }
}

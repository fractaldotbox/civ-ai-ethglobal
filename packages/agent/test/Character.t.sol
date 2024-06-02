// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { Test } from "forge-std/src/Test.sol";
import { console2 } from "forge-std/src/console2.sol";

import { CivAIAgent } from "../src/CivAIAgent.sol";
import { ChatOracle } from "../src/ChatOracle.sol";

interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
}

contract CivAIAgentTest is Test {
    CivAIAgent internal civAIAgent;
    address initialOracleAddress = 0x4168668812C94a3167FCd41D12014c5498D74d7e;

    // backup non TEE
    // address initialOracleAddress =0xEcdeb01037C848515e12158Dae412dc2b86EB066;


    /// @dev A function invoked before each test case is run.
    function setUp() public virtual {
        vm.createSelectFork({ urlOrAlias: "https://devnet.galadriel.com", blockNumber: 12967887 });

        // Instantiate the contract-under-test.
        civAIAgent = new CivAIAgent(
            initialOracleAddress
        );


        // oracle only
        // ChatOracle(initialOracleAddress).updateWhitelist(address(civAIAgent), true);

        // const pcr0Hash = "5c8ce02f8c739a6578886ef009dc27dc69ac85a631689b093f75f6ae238e10d70a08dce8f0cafdd1f7d9b3a26c889565";

        
    }

    function test_startChat() external {
        string memory message = "what's your name?";


        uint  runId = civAIAgent.startChat(message);
        assertEq(runId, 0, "value mismatch");

        // // CivAIAgent.ChatRun memory chatRun = civAIAgent.chatRuns(chatRunId);

        // CivAIAgent.ChatRun storage run = civAIAgent.chatRuns(runId);

        CivAIAgent.ChatRun memory run = civAIAgent.getChatRun(runId);

        console2.log(run.messagesCount);
        console2.log(run.messages[0].content);

        vm.sleep(240_000);

        string[] memory contents = civAIAgent.getMessageHistoryContents(runId);

        // vm.sleep(120_000);
        console2.log(contents.length);
        // assertEq(run.owner, address(civAIAgent), "value mismatch");

        // wont actually response, fake our own oracle
        // https://github.com/0xVivaLabs/proof-of-prompt-contract/blob/8d14b00e61caa0495b04ef57d29a7d09d7c8e056/test/Agent.t.sol#L10

        assertEq(contents[0], "");
    }



    // /// @dev Basic test. Run it with `forge test -vvv` to see the console log.
    // function test_Example() external view {
    //     console2.log("Hello World");
    //     uint256 x = 42;
    //     assertEq(foo.id(x), x, "value mismatch");
    // }

    // /// @dev Fuzz test that provides random values for an unsigned integer, but which rejects zero as an input.
    // /// If you need more sophisticated input validation, you should use the `bound` utility instead.
    // /// See https://twitter.com/PaulRBerg/status/1622558791685242880
    // function testFuzz_Example(uint256 x) external view {
    //     vm.assume(x != 0); // or x = bound(x, 1, 100)
    //     assertEq(foo.id(x), x, "value mismatch");
    // }

    // /// @dev Fork test that runs against an Ethereum Mainnet fork. For this to work, you need to set `API_KEY_ALCHEMY`
    // /// in your environment You can get an API key for free at https://alchemy.com.
    // function testFork_Example() external {
    //     // Silently pass this test if there is no API key.
    //     string memory alchemyApiKey = vm.envOr("API_KEY_ALCHEMY", string(""));
    //     if (bytes(alchemyApiKey).length == 0) {
    //         return;
    //     }

    //     // Otherwise, run the test against the mainnet fork.
    //     vm.createSelectFork({ urlOrAlias: "mainnet", blockNumber: 16_428_000 });
    //     address usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    //     address holder = 0x7713974908Be4BEd47172370115e8b1219F4A5f0;
    //     uint256 actualBalance = IERC20(usdc).balanceOf(holder);
    //     uint256 expectedBalance = 196_307_713.810457e6;
    //     assertEq(actualBalance, expectedBalance);
    // }
}

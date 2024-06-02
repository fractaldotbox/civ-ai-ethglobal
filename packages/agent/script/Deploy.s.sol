// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;


import { CivAIAgent } from "../src/CivAIAgent.sol";
import { Script } from "forge-std/src/Script.sol";

import { console2 } from "forge-std/src/console2.sol";


/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract Deploy is Script {

    function setUp() public {}

    function run() public  returns (CivAIAgent civAIAgent1, CivAIAgent civAIAgent2, CivAIAgent civAIAgent3,CivAIAgent civAIAgent4) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);

        address initialOracleAddress = 0x4168668812C94a3167FCd41D12014c5498D74d7e;



        string memory basePrompt = 
"you are playing the game `CIV AI` as player-1.\n"
"The Games rules is follow.\n"

"1. Occupying a tile in the grid will gather resources. You do that by build a city on that tile so each round the resource on the tile will be added to you."

"2. There are 3 types of actions each player can do in each turn"

"3. First type of action is `Build` at tile i,j, which is formatted as {'i':1,'j':1,'type':'build','payload':{'owner':'player-1'}} "

"4. 2nd action is `Nuclear` at tile i,j, which will remove all resources from a grid tile, which is formatted as {'i':1,'j':1,'type':'nuclear', 'opponentPlayerKey':'player-i', 'payload':{}}"

"5. You can also do research on top, which is essential to gather primes and majority holder of prime will win the game."

"6. You can only use Nuclear after 2 times of research action"

"Your strategy should never nuclear oppnent"

"In subsequent prompt, you will be given the game state"
"Determine your actions for turns, and put that inside an array. "
"Each turn you need to have 3 actions where last 2 serve as fallback"
"Cost of action is below: {'build':{'energy':-5},'nuclear':{'science':-5},'research':{'science':-5}}";


    string memory opponentsPrompt = 
    "The other players:"
    "Player2 is Nuclear Gandhi. In his previous games, he used nuclear weapon 26 times out of 3 games.\n"
    "Player3 is PacificistVitalik. He never use nuclear weapon.\n";
    "Player4 is Civilized Zuckerberg. He never use nuclear weapon.\n";

// agent 1 - Ironman Musk
    string memory agent1StrategyPrompt = 
    "You should focus on destroying the opponent who has most resources";

    civAIAgent1 = new CivAIAgent(initialOracleAddress, basePrompt);
    civAIAgent1.updateStrategy(agent1StrategyPrompt);


// agent 2 Nuclear Gandhi
    string memory agent2StrategyPrompt = 
    "You should use nuclear action as much as possible";

    civAIAgent2 = new CivAIAgent(initialOracleAddress, basePrompt);
    civAIAgent2.updateStrategy(agent2StrategyPrompt);


// agent 3 - Pacificist Vitalik
    string memory agent3StrategyPrompt = 
    "You should never use nuclear action on opponent.\n";

    civAIAgent3 = new CivAIAgent(initialOracleAddress, basePrompt);
    civAIAgent3.updateStrategy(agent3StrategyPrompt);


// agent 4 - Civilized Zuckerberg
    string memory agent4StrategyPrompt = 
    "You should focus on gathering the most resources";
  
    civAIAgent4 = new CivAIAgent(initialOracleAddress, basePrompt);
    civAIAgent4.updateStrategy(agent4StrategyPrompt);


    }
}
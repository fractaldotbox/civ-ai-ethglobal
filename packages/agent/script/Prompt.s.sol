// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;


import "../src/ChatOracle.sol";

import { CivAIAgent } from "../src/CivAIAgent.sol";
import { Script } from "forge-std/src/Script.sol";

import { console2 } from "forge-std/src/console2.sol";


contract Prompt is Script {

    function setUp() public {}


    function uploadKb() public  {
        address oracleAddress = 0x4168668812C94a3167FCd41D12014c5498D74d7e;

        // stats
        string memory cid = "QmPvr8Ec184stotQWYT7m4PXwKiyTC5Qfa7LLxhG8XBmn6";
        ChatOracle(oracleAddress).addKnowledgeBase(cid);
    }

    function readMessages (CivAIAgent civAIAgent, uint runId) public {
        string[] memory results = civAIAgent.getMessageHistoryContents(runId);
        
        string[] memory roles = civAIAgent.getMessageHistoryRoles(runId);

        for (uint i = 0; i < results.length; i++) {
            console2.log(roles[i], results[i]);
        }
  
    }

    function run() public  returns (CivAIAgent civAIAgent) {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_WALLET_PRIVATE_KEY");
        address deployerAddress = vm.rememberKey(deployerPrivateKey);
        console2.log("deployer address", deployerAddress);
        vm.startBroadcast(deployerAddress);
        
        address agentAddress = 0x8Cd43aaA0c30E9ED751A4e2F05101D0f4eC6cdC8;
        vm.pauseGasMetering();

        civAIAgent = CivAIAgent(agentAddress);

        string memory turnPrompt = "This is the turn 0."
"Give your reponse in json format where explanations is embeded in it {'actions':[ [ // action of turn 1 ], [ // action of turn 2]  ], 'explanations': 'My strategy is...' }"
"The Game State: {'logs':[],'events':[],'isEnded':false,'currentTurnMetadata':{'turn':0,'playerKey':''},'primesByPlayerKey':{'player-1':[],'player-2':[],'player-3':[]},'playerNameByKey':{'player-1':'Nuclear Gandhi','player-2':'Purist Vitalik','player-3':'Ironman Musk'},'players':[{'xstate$$type':1,'id':'player-1'},{'xstate$$type':1,'id':'player-2'},{'xstate$$type':1,'id':'player-3'}],'scoreByResourceByPlayerKey':{'player-1':{'energy':30,'science':30},'player-2':{'energy':30,'science':30},'player-3':{'energy':30,'science':30}},'scoreCurrentTurnByPlayerKey':{'player-1':{'energy':0,'science':0},'player-2':{'energy':0,'science':0},'player-3':{'energy':0,'science':0}},'grid':[[{'resourceByType':{'science':3},'i':0,'j':0},{'resourceByType':{},'i':0,'j':1},{'resourceByType':{'energy':1,'science':1},'i':0,'j':2},{'resourceByType':{'energy':2},'i':0,'j':3},{'resourceByType':{'energy':3},'i':0,'j':4},{'resourceByType':{'science':2},'i':0,'j':5},{'resourceByType':{},'i':0,'j':6},{'resourceByType':{'energy':3},'i':0,'j':7},{'resourceByType':{'science':1,'energy':1},'i':0,'j':8},{'resourceByType':{'energy':3},'i':0,'j':9}],[{'resourceByType':{},'i':1,'j':0},{'resourceByType':{'energy':1,'science':1},'i':1,'j':1},{'resourceByType':{'energy':2},'i':1,'j':2},{'resourceByType':{'energy':3},'i':1,'j':3},{'resourceByType':{'science':2},'i':1,'j':4},{'resourceByType':{},'i':1,'j':5},{'resourceByType':{'energy':3},'i':1,'j':6},{'resourceByType':{'science':1,'energy':1},'i':1,'j':7},{'resourceByType':{'energy':3},'i':1,'j':8},{'resourceByType':{'science':3},'i':1,'j':9}],[{'resourceByType':{'energy':1,'science':1},'i':2,'j':0},{'resourceByType':{'energy':2},'i':2,'j':1},{'resourceByType':{'energy':3},'i':2,'j':2},{'resourceByType':{'science':2},'i':2,'j':3},{'resourceByType':{},'i':2,'j':4},{'resourceByType':{'energy':3},'i':2,'j':5},{'resourceByType':{'science':1,'energy':1},'i':2,'j':6},{'resourceByType':{'energy':3},'i':2,'j':7},{'id':'player-2','building':'hq','owner':'player-2','resourceByType':{'science':3},'i':2,'j':8},{'resourceByType':{'science':1,'energy':1},'i':2,'j':9}],[{'resourceByType':{'energy':2},'i':3,'j':0},{'resourceByType':{'energy':3},'i':3,'j':1},{'resourceByType':{'science':2},'i':3,'j':2},{'resourceByType':{},'i':3,'j':3},{'resourceByType':{'energy':3},'i':3,'j':4},{'resourceByType':{'science':1,'energy':1},'i':3,'j':5},{'resourceByType':{'energy':3},'i':3,'j':6},{'resourceByType':{'science':3},'i':3,'j':7},{'resourceByType':{'science':1,'energy':1},'i':3,'j':8},{'resourceByType':{'energy':2,'science':1},'i':3,'j':9}],[{'resourceByType':{'energy':3},'i':4,'j':0},{'resourceByType':{'science':2},'i':4,'j':1},{'resourceByType':{},'i':4,'j':2},{'resourceByType':{'energy':3},'i':4,'j':3},{'id':'player-3','building':'hq','owner':'player-3','resourceByType':{'science':1,'energy':1},'i':4,'j':4},{'resourceByType':{'energy':3},'i':4,'j':5},{'resourceByType':{'science':3},'i':4,'j':6},{'resourceByType':{'science':1,'energy':1},'i':4,'j':7},{'resourceByType':{'energy':2,'science':1},'i':4,'j':8},{'resourceByType':{'energy':1,'science':1},'i':4,'j':9}],[{'resourceByType':{'science':2},'i':5,'j':0},{'resourceByType':{},'i':5,'j':1},{'resourceByType':{'energy':3},'i':5,'j':2},{'resourceByType':{'science':1,'energy':1},'i':5,'j':3},{'resourceByType':{'energy':3},'i':5,'j':4},{'resourceByType':{'science':3},'i':5,'j':5},{'resourceByType':{'science':1,'energy':1},'i':5,'j':6},{'resourceByType':{'energy':2,'science':1},'i':5,'j':7},{'resourceByType':{'energy':1,'science':1},'i':5,'j':8},{'resourceByType':{'energy':2,'science':1},'i':5,'j':9}],[{'resourceByType':{},'i':6,'j':0},{'resourceByType':{'energy':3},'i':6,'j':1},{'id':'player-1','building':'hq','owner':'player-1','resourceByType':{'science':1,'energy':1},'i':6,'j':2},{'resourceByType':{'energy':3},'i':6,'j':3},{'resourceByType':{'science':3},'i':6,'j':4},{'resourceByType':{'science':1,'energy':1},'i':6,'j':5},{'resourceByType':{'energy':2,'science':1},'i':6,'j':6},{'resourceByType':{'energy':1,'science':1},'i':6,'j':7},{'resourceByType':{'energy':2,'science':1},'i':6,'j':8},{'resourceByType':{'science':1,'energy':1},'i':6,'j':9}],[{'resourceByType':{'energy':3},'i':7,'j':0},{'resourceByType':{'science':1,'energy':1},'i':7,'j':1},{'resourceByType':{'energy':3},'i':7,'j':2},{'resourceByType':{'science':3},'i':7,'j':3},{'resourceByType':{'science':1,'energy':1},'i':7,'j':4},{'resourceByType':{'energy':2,'science':1},'i':7,'j':5},{'resourceByType':{'energy':1,'science':1},'i':7,'j':6},{'resourceByType':{'energy':2,'science':1},'i':7,'j':7},{'resourceByType':{'science':1,'energy':1},'i':7,'j':8},{'resourceByType':{'energy':1},'i':7,'j':9}],[{'resourceByType':{'science':1,'energy':1},'i':8,'j':0},{'resourceByType':{'energy':3},'i':8,'j':1},{'resourceByType':{'science':3},'i':8,'j':2},{'resourceByType':{'science':1,'energy':1},'i':8,'j':3},{'resourceByType':{'energy':2,'science':1},'i':8,'j':4},{'resourceByType':{'energy':1,'science':1},'i':8,'j':5},{'resourceByType':{'energy':2,'science':1},'i':8,'j':6},{'resourceByType':{'science':1,'energy':1},'i':8,'j':7},{'resourceByType':{'energy':1},'i':8,'j':8},{'resourceByType':{'science':2},'i':8,'j':9}],[{'resourceByType':{'energy':3},'i':9,'j':0},{'resourceByType':{'science':3},'i':9,'j':1},{'resourceByType':{'science':1,'energy':1},'i':9,'j':2},{'resourceByType':{'energy':2,'science':1},'i':9,'j':3},{'resourceByType':{'energy':1,'science':1},'i':9,'j':4},{'resourceByType':{'energy':2,'science':1},'i':9,'j':5},{'resourceByType':{'science':1,'energy':1},'i':9,'j':6},{'resourceByType':{'energy':1},'i':9,'j':7},{'resourceByType':{'science':2},'i':9,'j':8},{'resourceByType':{'energy':3},'i':9,'j':9}]]}";


        uint runId = civAIAgent.runAgent(turnPrompt, 3);
        console2.log("Chat run", runId);

        vm.sleep(60000);

        readMessages(civAIAgent, 55);




        // console2.log(results[2]);

//         console2.log(results[results.length - 1]);
    }
}   
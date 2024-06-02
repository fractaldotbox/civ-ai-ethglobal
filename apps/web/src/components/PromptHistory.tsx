


import Button from "./Button"
import Image from 'next/image'
import { useGameContext } from "./GameContextProvider"
import PromptHistoryModal from "./PromptHistoryModal";

const abi = [{ "type": "constructor", "inputs": [{ "name": "initialOracleAddress", "type": "address", "internalType": "address" }], "stateMutability": "nonpayable" }, { "type": "function", "name": "addMessage", "inputs": [{ "name": "message", "type": "string", "internalType": "string" }, { "name": "runId", "type": "uint256", "internalType": "uint256" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "chatRuns", "inputs": [{ "name": "", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "messagesCount", "type": "uint256", "internalType": "uint256" }], "stateMutability": "view" }, { "type": "function", "name": "getChatRun", "inputs": [{ "name": "chatId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "tuple", "internalType": "struct CivAIAgent.ChatRun", "components": [{ "name": "owner", "type": "address", "internalType": "address" }, { "name": "messages", "type": "tuple[]", "internalType": "struct CivAIAgent.Message[]", "components": [{ "name": "role", "type": "string", "internalType": "string" }, { "name": "content", "type": "string", "internalType": "string" }] }, { "name": "messagesCount", "type": "uint256", "internalType": "uint256" }] }], "stateMutability": "view" }, { "type": "function", "name": "getMessageHistoryContents", "inputs": [{ "name": "chatId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "string[]", "internalType": "string[]" }], "stateMutability": "view" }, { "type": "function", "name": "getMessageHistoryRoles", "inputs": [{ "name": "chatId", "type": "uint256", "internalType": "uint256" }], "outputs": [{ "name": "", "type": "string[]", "internalType": "string[]" }], "stateMutability": "view" }, { "type": "function", "name": "onOracleFunctionResponse", "inputs": [{ "name": "runId", "type": "uint256", "internalType": "uint256" }, { "name": "response", "type": "string", "internalType": "string" }, { "name": "errorMessage", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "onOracleOpenAiLlmResponse", "inputs": [{ "name": "runId", "type": "uint256", "internalType": "uint256" }, { "name": "response", "type": "tuple", "internalType": "struct IOracle.OpenAiResponse", "components": [{ "name": "id", "type": "string", "internalType": "string" }, { "name": "content", "type": "string", "internalType": "string" }, { "name": "functionName", "type": "string", "internalType": "string" }, { "name": "functionArguments", "type": "string", "internalType": "string" }, { "name": "created", "type": "uint64", "internalType": "uint64" }, { "name": "model", "type": "string", "internalType": "string" }, { "name": "systemFingerprint", "type": "string", "internalType": "string" }, { "name": "object", "type": "string", "internalType": "string" }, { "name": "completionTokens", "type": "uint32", "internalType": "uint32" }, { "name": "promptTokens", "type": "uint32", "internalType": "uint32" }, { "name": "totalTokens", "type": "uint32", "internalType": "uint32" }] }, { "name": "errorMessage", "type": "string", "internalType": "string" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "oracleAddress", "inputs": [], "outputs": [{ "name": "", "type": "address", "internalType": "address" }], "stateMutability": "view" }, { "type": "function", "name": "setOracleAddress", "inputs": [{ "name": "newOracleAddress", "type": "address", "internalType": "address" }], "outputs": [], "stateMutability": "nonpayable" }, { "type": "function", "name": "startChat", "inputs": [{ "name": "message", "type": "string", "internalType": "string" }], "outputs": [{ "name": "i", "type": "uint256", "internalType": "uint256" }], "stateMutability": "nonpayable" }, { "type": "event", "name": "ChatCreated", "inputs": [{ "name": "owner", "type": "address", "indexed": true, "internalType": "address" }, { "name": "chatId", "type": "uint256", "indexed": true, "internalType": "uint256" }], "anonymous": false }, { "type": "event", "name": "OracleAddressUpdated", "inputs": [{ "name": "newOracleAddress", "type": "address", "indexed": true, "internalType": "address" }], "anonymous": false }];


import { http, createConfig, getPublicClient, getWalletClient } from '@wagmi/core'
import { useEffect, useState } from 'react'
export default () => {



    const [initPrompts, setInitPrompts] = useState([])


    // getAgentContract()

    useEffect(() => {
        // if (!contract?.read) {
        //     return;
        // }
        // @ts-ignore
        (async () => {

            // from game state

            // const messages = await contract.read.getMessageHistoryContents([0]);
            // console.log('messages', messages)
            // if (messages.length >= 2) {
            //     const [basePrompt, strategyPrompt, ...restMessages] = messages as anyz[];

            //     setInitPrompts([basePrompt, strategyPrompt])
            // }

        })();


    }, [])

    const { gameState } = useGameContext();
    if (!gameState) {
        return <></>
    }

    const { players } = gameState;

    const playerKeys = players.map(({ playerKey }) => playerKey);


    const basePrompt = '';
    return (
        <div>
            <PromptHistoryModal playerKeys={playerKeys} basePrompt={basePrompt} messages={[]} />
        </div>
    )
}

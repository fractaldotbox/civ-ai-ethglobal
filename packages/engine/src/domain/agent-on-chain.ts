import {
  PublicClient,
  createWalletClient,
  createPublicClient,
  defineChain,
  getContract,
  http,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export type address = `0x${string}`;

export const AGENT_ABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'initialOracleAddress',
        type: 'address',
        internalType: 'address',
      },
      { name: 'basePrompt', type: 'string', internalType: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'agentRuns',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'responsesCount', type: 'uint256', internalType: 'uint256' },
      { name: 'max_iterations', type: 'uint8', internalType: 'uint8' },
      { name: 'is_finished', type: 'bool', internalType: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMessageHistoryContents',
    inputs: [{ name: 'agentId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'string[]', internalType: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMessageHistoryRoles',
    inputs: [{ name: 'agentId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'string[]', internalType: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'isRunFinished',
    inputs: [{ name: 'runId', type: 'uint256', internalType: 'uint256' }],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'onOracleFunctionResponse',
    inputs: [
      { name: 'runId', type: 'uint256', internalType: 'uint256' },
      { name: 'response', type: 'string', internalType: 'string' },
      { name: 'errorMessage', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'onOracleOpenAiLlmResponse',
    inputs: [
      { name: 'runId', type: 'uint256', internalType: 'uint256' },
      {
        name: 'response',
        type: 'tuple',
        internalType: 'struct IOracle.OpenAiResponse',
        components: [
          { name: 'id', type: 'string', internalType: 'string' },
          { name: 'content', type: 'string', internalType: 'string' },
          { name: 'functionName', type: 'string', internalType: 'string' },
          { name: 'functionArguments', type: 'string', internalType: 'string' },
          { name: 'created', type: 'uint64', internalType: 'uint64' },
          { name: 'model', type: 'string', internalType: 'string' },
          { name: 'systemFingerprint', type: 'string', internalType: 'string' },
          { name: 'object', type: 'string', internalType: 'string' },
          { name: 'completionTokens', type: 'uint32', internalType: 'uint32' },
          { name: 'promptTokens', type: 'uint32', internalType: 'uint32' },
          { name: 'totalTokens', type: 'uint32', internalType: 'uint32' },
        ],
      },
      { name: 'errorMessage', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'oracleAddress',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'prompt',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'runAgent',
    inputs: [
      { name: 'query', type: 'string', internalType: 'string' },
      { name: 'max_iterations', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [{ name: 'i', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setOracleAddress',
    inputs: [
      { name: 'newOracleAddress', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateStrategy',
    inputs: [
      { name: 'strategyPrompt', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'AgentRunCreated',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'runId',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OracleAddressUpdated',
    inputs: [
      {
        name: 'newOracleAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
];

export const galadriel = defineChain({
  id: 696969,
  name: 'Galadriel',
  nativeCurrency: {
    decimals: 18,
    name: 'GALA',
    symbol: 'GAL',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.galadriel.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.zora.energy' },
  },
  // contracts: {
  //     multicall3: {
  //         address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  //         blockCreated: 5882,
  //     },
  // },
});

export const config = {
  chain: galadriel,
  transport: http(),
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const getAgentPublicContract = (address: string): any => {
  const publicClient = createPublicClient(config);

  // const contract = getContract({
  //   address: address as `0x${string}`,
  //   abi: AGENT_ABI,
  //   client: publicClient,
  // });

  // return contract;
  return publicClient;
};

export const getAgentClient = (address: string): any => {
  const gameMasterKey =
    '0x3db76cdd104b07bebf2221076fab7485c03b59f5af25322497763a52b05bd94c';

  // const gameMasterKey = process.env.NEXT_PUBLIC_GAME_MASTER_PRIVATE_KEY;

  const contractAddress =
    '0x8Cd43aaA0c30E9ED751A4e2F05101D0f4eC6cdC8' as address;

  const account = privateKeyToAccount(gameMasterKey);
  const client: WalletClient = createWalletClient({
    account,
    ...config,
  });

  const publicClient = getAgentPublicContract(contractAddress);

  return {
    chat: async (prompt: string) => {
      const params = {
        address: contractAddress,
        functionName: 'runAgent',
        args: [prompt, 3],
        abi: AGENT_ABI,
        chain: galadriel,
        account,
      };

      const { request, result: runId } =
        await publicClient.simulateContract(params);

      const hash = await client.writeContract(params);

      console.log('hash', hash);

      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      // hard parsing from log for runId, easier to simulate

      // wait long enough for oracle to respond

      const timeout = 50 * 1000;

      console.log('runId', runId);
      console.log('timeout', timeout);
      await sleep(timeout);

      const messages = await publicClient.readContract({
        address: contractAddress,
        functionName: 'getMessageHistoryContents',
        args: [runId],
        abi: AGENT_ABI,
        chain: galadriel,
        account,
      });
      console.log('messages count', messages.length);

      const lastMessage = messages[messages.length - 1];

      const response = JSON.parse(lastMessage);

      return { messages, response };
    },
  };
  // client.writeContract({
  //   address: address as `0x${string}`,
  //   abi: AGENT_ABI,
  // });

  // const contract = getContract({
  //   address: address as `0x${string}`,
  //   abi: AGENT_ABI,
  //   client,
  // });

  // return contract;
};

export type GameEvent = {
  key: string;
  title: string;
  imageSrc?: string;
  description: string;
};

export const STANDARD_GAME_EVENT_TEMPLATES = [
  () => ({
    key: 'welcome',
    title: 'Welcome to CIV AI',
    imageSrc: '/civai1.jpg',
    description: `
    Goal of the game is to research for AGI.
    Players of AI agents will be competing for resources\n
They might build city, extending tiles to gather more resources, or nuke each other.

All actions of AI agent is recorded and each agent's reputation can be determined. 
Staying ahead, or frequent use of nuke will attract attacks.

Each player can spend resources to start research project, which is to find prime numbers.
Whoever find AGI -- by finding 100 prime numbers first will win the game (Scentific Victory).

Every 5 turn, ther is an opportunity for AI to collaborate on a research.
Which they are able to combine resources and split results equallly. 
AI can decide if they do so. 
    `,
  }),
  ({ playerKey }: { playerKey: string }) => ({
    key: 'victory-scentific',
    imageSrc: '/civai2.jpg',
    title: `${playerKey} has researched AGI! `,
    description: `
   OK You win
    `,
  }),
] as ((context?: any) => GameEvent)[];

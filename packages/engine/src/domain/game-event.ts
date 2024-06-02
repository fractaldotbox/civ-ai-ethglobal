import { keys } from "lodash";

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
  ({regionId, name, windSpeed, solarIrradiance} : {regionId: String, name: String, windSpeed: number, solarIrradiance: number}) => {
    console.log('regionId = ', regionId);
    let keySuffix = '';
    let weatherDescription = '';
    let effectDescription = '';
    if (windSpeed < 5 && solarIrradiance < 500) {
      // no event
      keySuffix = '-normal';
      weatherDescription = 'normal';
      effectDescription = 'Nothing special happens';
    } else if (windSpeed > 5 && solarIrradiance < 500) {
      // windy
      keySuffix = '-windy';
      weatherDescription = 'windy 🌀';
      effectDescription = 'The performance of wind turbines will be doubled from this turn 🚀';
    } else if (windSpeed < 5 && solarIrradiance > 500) {
      // sunny
      keySuffix = '-sunny';
      weatherDescription = 'sunny 🌞';
      effectDescription = ' The performance of solar panels will be doubled from this turn 🚀';
    } else {
      // windy and sunny
      keySuffix = '-windy-sunny';
      weatherDescription = 'windy and sunny 🌀🌞';
      effectDescription = 'The performance of solar panels and wind turbines will be doubled from this turn 🚀🚀';
    }
    return {
      key: `region${regionId}${keySuffix}`,
      title: `${name} has a ${weatherDescription} day`,
      imageSrc: `/region${regionId}${keySuffix}.png`,
      description: `${name} is experiencing a ${weatherDescription} day. ${effectDescription}`,
    };
  }
] as ((context?: any) => GameEvent)[];

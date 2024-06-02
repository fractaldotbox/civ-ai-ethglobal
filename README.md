# CIV


# Civ AI: Autonomous World for AI Civilizations


This is a submission of ETHGlobal HACKFS 2024 | [Project Page](https://ethglobal.com/showcase/civ-ai-miwn2) | [Introductory Deck](https://docs.google.com/presentation/d/10qdGVISj67BH8Hy150SMLdkbPo8HjnYgQAEhHCT9w1s/edit#slide=id.p).

Welcome to CivAI! This project is an Autonomous World, a simulation game where on-chain AI agents collaborate & compete with each other to research Artificial General Intelligence (AGI). Inspired by classic civilization-building games, CivAI incorporates real-time data, advanced AI models, and blockchain technology for a dynamic and competitive research environment. They are able to use Coophive to collaborate on scentifice research (finding prime numbers)


Motivation of the simulation is to explore how we could use on-chain reputations and game theoertic incentives to govern  AI agents, and how to foster collaborations.
If AI become a superintelligence, we don't want a Nuclear Gandhi


![img](/apps/web/public/civai_ss2.png)

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Mechanics](#mechanics)
4. [Tech Stack](#tech-stack)
5. [Installation](#installation)
6. [Usage](#usage)
7. [License](#license)
8. [Acknowledgements](#acknowledgements)

## Introduction

CivAI is a simplified version of civilization games with no human players. Instead, autonomous AI agents, each with unique capabilities and strategies, vie to be the first to achieve AGI. The game leverages real-world data, advanced AI models, and blockchain technology to create a realistic and engaging simulation.

## Features

- **Autonomous on-chain AI Agents**: On-chain agents powered by LLM models & Galadriel
- **Real-Time Weather Integration**: Uses WeatherXM for real-world weather events affecting gameplay.
- **Advanced AI Models**: Simulated AI agents powered by OpenAI models.
- **Blockchain Deployment**: On-chain AI agents deployed using Galadriel for transparency and security.
- **Visualization**: Visual representation of agents' progress and interactions.
- **Competitive Research Environment**: Agents compete in researching and developing AGI with progress tracked and displayed.
- **On-Chain Reputation**: Actions and reputations of agents are stored on-chain, affecting their strategic options.

## Mechanics

### Game Mechanics

- **Grid-Based System**: The game operates on a grid where agents utilize resources like energy (⚡) and science (🧪).
- **Turn-Based Actions**: Agents perform actions such as building, researching, and collaborating in turns.
- **Pre-Created AI Agents**: Includes unique agents like Nuclear Gandhi, Ironman Musk, Civilized Zuckerberg, and Pacifist Vitalik.
- **Resource Management**: Agents gather and use resources strategically to progress.
- **Real-World Weather Events**: Weather events influence gameplay based on real-world data, with effects such as solar and wind energy boosts.
- **On-Chain Reputation System**: Agents' actions and reputations are tracked on-chain, affecting their interactions and strategies.
- **Agent Customization**: Players can create and deploy their own agents, customizing parameters stored in an NFT-like fashion.
- **Research Collaboration**: Agents can form alliances to combine research power and split rewards.
- **Turn-Based Updates**: Strategies and actions are updated every 5 turns, with specific events happening at set intervals.

### Winning Conditions 

- **Scientific Victory**: Achieved by being the first to research AGI. 
- **Prime Number Research**: Get the most prime numbers after 30 turns, with higher primes requiring more science points

### Potential Strategies

- **Collaborative Research**: Form alliances with other agents to pool research resources and split outcome, achieve faster progress.
- **Know your Opponent**: Base on on-chain reputations and context, identify if particular agent use nuclear heavily and try to defeat him/her together first.   
- **Resource Optimization**: Efficiently manage energy and science resources to maximize research output.
- **Reputation Management**: Maintain a good on-chain reputation to attract collaborations and avoid conflicts.
- **Adaptation to Weather Events**: Leverage real-world weather data to optimize resource generation and utilization.

## Tech Stack


- [WeatherXM](https://weatherxm.com) for real-world weather data.
- [OpenAI](https://openai.com) for advanced AI models.
- [Galadriel](https://galadriel.com) for blockchain deployment.
- [XState](https://xstate.js.org) for managing complex states.
- [Coophive](https://coophive.com) for collaboration and orchestration of AI agents.
- [TypeScript](https://www.typescriptlang.org) for strongly-typed JavaScript.
- [Tailwind CSS](https://tailwindcss.com) for styling.
- [DaisyUI](https://daisyui.com) for UI components.
- [React Flow](https://reactflow.dev) for visualizing flows.
- [React](https://reactjs.org) for building user interfaces.

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/civai-research-game.git
   cd civai-research-game
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory based on the `env.template` file and add your API keys and necessary configuration:
   ```

   WEATHERXM_API_KEY=your_weatherxm_api_key
   OPENAI_API_KEY=your_openai_api_key
   GALADRIEL_CONFIG=your_galadriel_configuration
   ```

### Game

To start the simulation, run:

```bash
 env-cmd pnpm --filter web run dev 
```

### Agents
- Use foundry to delpoy
 - cd packages/contract
 - Deploy agents to Galadriel, note `--legacy` required
   - env-cmd -f ../../.env forge script --legacy script/Deploy.s.sol --via-ir --rpc-url https://devnet.galadriel.com --broadcast  --gas-price 1000000000 --gas-limit 1000000000


## Acknowledgements

This project was made possible thanks to the following technologies and frameworks:

- [WeatherXM](https://weatherxm.com) for real-world weather data.
- [OpenAI](https://openai.com) for advanced AI models.
- [Galadriel](https://galadriel.com) for blockchain deployment.
- [TypeScript](https://www.typescriptlang.org) for strongly-typed JavaScript.
- [React](https://reactjs.org) for building user interfaces.
- [React Flow](https://reactflow.dev) for visualizing flows.
- [XState](https://xstate.js.org) for managing complex states.
- [Tailwind CSS](https://tailwindcss.com) for styling.
- [DaisyUI](https://daisyui.com) for UI components.

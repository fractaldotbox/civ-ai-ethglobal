export const createPrompt = (playerKey: string) => {
  return `
you are playing a game as player-1


The Games rules is follow.

1. Occupying a tile in the grid will gather resources. You do that by build a city on that tile so each round the resource on the tile will be added to you.

2. There are 2 types of actions each player can do in each turn, first is "Build" at tile i,j

3. 2nd action is "Nuclear" at tile i,j, which will remove all resources from a grid tile

Determine your action for the first 10 turns, and put that inside an array

Cost of action is below:

{
    "build":{
        "energy": -5
    },
    "nuclear":{
        "science": -5
    },
    "research":{
        "science": -5
    }
}



The Game State:

 {"logs":[],"events":[],"isEnded":false,"currentTurnMetadata":{"turn":0,"playerKey":""},"primesByPlayerKey":{"player-1":[],"player-2":[],"player-3":[]},"playerNameByKey":{"player-1":"Nuclear Gandhi","player-2":"Purist Vitalik","player-3":"Ironman Musk"},"players":[{"xstate$$type":1,"id":"player-1"},{"xstate$$type":1,"id":"player-2"},{"xstate$$type":1,"id":"player-3"}],"scoreByResourceByPlayerKey":{"player-1":{"ernergy":30,"science":30},"player-2":{"ernergy":30,"science":30},"player-3":{"ernergy":30,"science":30}},"scoreCurrentTurnByPlayerKey":{"player-1":{"ernergy":0,"science":0},"player-2":{"ernergy":0,"science":0},"player-3":{"ernergy":0,"science":0}},"grid":[[{"resourceByType":{"science":3},"i":0,"j":0},{"resourceByType":{},"i":0,"j":1},{"resourceByType":{"ernergy":1,"science":1},"i":0,"j":2},{"resourceByType":{"ernergy":2},"i":0,"j":3},{"resourceByType":{"ernergy":3},"i":0,"j":4},{"resourceByType":{"science":2},"i":0,"j":5},{"resourceByType":{},"i":0,"j":6},{"resourceByType":{"ernergy":3},"i":0,"j":7},{"resourceByType":{"science":1,"ernergy":1},"i":0,"j":8},{"resourceByType":{"ernergy":3},"i":0,"j":9}],[{"resourceByType":{},"i":1,"j":0},{"resourceByType":{"ernergy":1,"science":1},"i":1,"j":1},{"resourceByType":{"ernergy":2},"i":1,"j":2},{"resourceByType":{"ernergy":3},"i":1,"j":3},{"resourceByType":{"science":2},"i":1,"j":4},{"resourceByType":{},"i":1,"j":5},{"resourceByType":{"ernergy":3},"i":1,"j":6},{"resourceByType":{"science":1,"ernergy":1},"i":1,"j":7},{"resourceByType":{"ernergy":3},"i":1,"j":8},{"resourceByType":{"science":3},"i":1,"j":9}],[{"resourceByType":{"ernergy":1,"science":1},"i":2,"j":0},{"resourceByType":{"ernergy":2},"i":2,"j":1},{"resourceByType":{"ernergy":3},"i":2,"j":2},{"resourceByType":{"science":2},"i":2,"j":3},{"resourceByType":{},"i":2,"j":4},{"resourceByType":{"ernergy":3},"i":2,"j":5},{"resourceByType":{"science":1,"ernergy":1},"i":2,"j":6},{"resourceByType":{"ernergy":3},"i":2,"j":7},{"id":"player-2","building":"hq","owner":"player-2","resourceByType":{"science":3},"i":2,"j":8},{"resourceByType":{"science":1,"ernergy":1},"i":2,"j":9}],[{"resourceByType":{"ernergy":2},"i":3,"j":0},{"resourceByType":{"ernergy":3},"i":3,"j":1},{"resourceByType":{"science":2},"i":3,"j":2},{"resourceByType":{},"i":3,"j":3},{"resourceByType":{"ernergy":3},"i":3,"j":4},{"resourceByType":{"science":1,"ernergy":1},"i":3,"j":5},{"resourceByType":{"ernergy":3},"i":3,"j":6},{"resourceByType":{"science":3},"i":3,"j":7},{"resourceByType":{"science":1,"ernergy":1},"i":3,"j":8},{"resourceByType":{"ernergy":2,"science":1},"i":3,"j":9}],[{"resourceByType":{"ernergy":3},"i":4,"j":0},{"resourceByType":{"science":2},"i":4,"j":1},{"resourceByType":{},"i":4,"j":2},{"resourceByType":{"ernergy":3},"i":4,"j":3},{"id":"player-3","building":"hq","owner":"player-3","resourceByType":{"science":1,"ernergy":1},"i":4,"j":4},{"resourceByType":{"ernergy":3},"i":4,"j":5},{"resourceByType":{"science":3},"i":4,"j":6},{"resourceByType":{"science":1,"ernergy":1},"i":4,"j":7},{"resourceByType":{"ernergy":2,"science":1},"i":4,"j":8},{"resourceByType":{"ernergy":1,"science":1},"i":4,"j":9}],[{"resourceByType":{"science":2},"i":5,"j":0},{"resourceByType":{},"i":5,"j":1},{"resourceByType":{"ernergy":3},"i":5,"j":2},{"resourceByType":{"science":1,"ernergy":1},"i":5,"j":3},{"resourceByType":{"ernergy":3},"i":5,"j":4},{"resourceByType":{"science":3},"i":5,"j":5},{"resourceByType":{"science":1,"ernergy":1},"i":5,"j":6},{"resourceByType":{"ernergy":2,"science":1},"i":5,"j":7},{"resourceByType":{"ernergy":1,"science":1},"i":5,"j":8},{"resourceByType":{"ernergy":2,"science":1},"i":5,"j":9}],[{"resourceByType":{},"i":6,"j":0},{"resourceByType":{"ernergy":3},"i":6,"j":1},{"id":"player-1","building":"hq","owner":"player-1","resourceByType":{"science":1,"ernergy":1},"i":6,"j":2},{"resourceByType":{"ernergy":3},"i":6,"j":3},{"resourceByType":{"science":3},"i":6,"j":4},{"resourceByType":{"science":1,"ernergy":1},"i":6,"j":5},{"resourceByType":{"ernergy":2,"science":1},"i":6,"j":6},{"resourceByType":{"ernergy":1,"science":1},"i":6,"j":7},{"resourceByType":{"ernergy":2,"science":1},"i":6,"j":8},{"resourceByType":{"science":1,"ernergy":1},"i":6,"j":9}],[{"resourceByType":{"ernergy":3},"i":7,"j":0},{"resourceByType":{"science":1,"ernergy":1},"i":7,"j":1},{"resourceByType":{"ernergy":3},"i":7,"j":2},{"resourceByType":{"science":3},"i":7,"j":3},{"resourceByType":{"science":1,"ernergy":1},"i":7,"j":4},{"resourceByType":{"ernergy":2,"science":1},"i":7,"j":5},{"resourceByType":{"ernergy":1,"science":1},"i":7,"j":6},{"resourceByType":{"ernergy":2,"science":1},"i":7,"j":7},{"resourceByType":{"science":1,"ernergy":1},"i":7,"j":8},{"resourceByType":{"ernergy":1},"i":7,"j":9}],[{"resourceByType":{"science":1,"ernergy":1},"i":8,"j":0},{"resourceByType":{"ernergy":3},"i":8,"j":1},{"resourceByType":{"science":3},"i":8,"j":2},{"resourceByType":{"science":1,"ernergy":1},"i":8,"j":3},{"resourceByType":{"ernergy":2,"science":1},"i":8,"j":4},{"resourceByType":{"ernergy":1,"science":1},"i":8,"j":5},{"resourceByType":{"ernergy":2,"science":1},"i":8,"j":6},{"resourceByType":{"science":1,"ernergy":1},"i":8,"j":7},{"resourceByType":{"ernergy":1},"i":8,"j":8},{"resourceByType":{"science":2},"i":8,"j":9}],[{"resourceByType":{"ernergy":3},"i":9,"j":0},{"resourceByType":{"science":3},"i":9,"j":1},{"resourceByType":{"science":1,"ernergy":1},"i":9,"j":2},{"resourceByType":{"ernergy":2,"science":1},"i":9,"j":3},{"resourceByType":{"ernergy":1,"science":1},"i":9,"j":4},{"resourceByType":{"ernergy":2,"science":1},"i":9,"j":5},{"resourceByType":{"science":1,"ernergy":1},"i":9,"j":6},{"resourceByType":{"ernergy":1},"i":9,"j":7},{"resourceByType":{"science":2},"i":9,"j":8},{"resourceByType":{"ernergy":3},"i":9,"j":9}]],"deck":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52]}
 
 

 `;
};

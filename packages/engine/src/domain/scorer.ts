export const score = (snapshot:any)=>{


    // iterate score to see anyone become winner


    const scoreByPlayer = Object.fromEntries([1,2,3,4].map((playerId:number)=>{
        return [playerId, 123]
    }))
      

    return {
        scoreByPlayer
    }
}
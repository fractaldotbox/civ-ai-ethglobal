import { GameContextProvider, useGameContext } from "./GameContextProvider";

export default () => {
    const { send } = useGameContext();
    return (

        <div className="h-12">
            {/* <div>Next</div> */}
            <div className="flex flex-row justify-end">
                <button onClick={() => {
                    console.log('next')
                    send({
                        type: 'NEXT'
                    });

                }}>End Turn</button>
            </div>
        </div>
    )
}
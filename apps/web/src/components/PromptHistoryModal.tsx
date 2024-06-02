import { useState } from "react"
import Button from "./Button"
import Image from 'next/image'
import { asPlayerKey } from "@repo/engine"


export const PromptCard = ({ title, promptMessage, response }: {
    title: string, promptMessage: string, response?: {
        action: any;
        explanation: string;
    }
}) => {

    const { action, explanation } = response || {};
    return (

        <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
                {title}
            </div>
            <div className="collapse-content">
                <p> {promptMessage}</p>
                <p> {promptMessage}</p>
                {
                    response && (
                        <>
                            <h2>Action</h2>
                            {JSON.stringify(action)}
                            <h2>Explanation</h2>
                            {explanation}
                        </>
                    )
                }

            </div>

        </div>
    )

}

export default ({ playerKeys, basePrompt, messages }: { playerKeys: string[], basePrompt: string, messages: string[] }) => {

    const [tabIndex, setTabIndex] = useState(0)

    const getTabClassName = (i: number) => ['tab', i === tabIndex ? 'tab-active' : ''].join(' ')

    return (
        <div>
            <dialog id="modal_prompt" className="modal">
                <div className="modal-box w-11/12 max-w-5xl flex flex-col">
                    <div role="tablist" className="tabs tabs-bordered">
                        {
                            playerKeys.map(
                                (playerKey, i) => {
                                    return (
                                        <a key={"tab-key-" + i} role="tab" className={getTabClassName(i)} onClick={() => setTabIndex(i)}>{playerKey}</a>
                                    )
                                }
                            )
                        }
                    </div>
                    <div className="w-full">
                        <div className="w-full flex justify-center flex-col">
                            <PromptCard title="Base Prompt" promptMessage={basePrompt} />
                            <PromptCard title="test" promptMessage="abc" />
                            <PromptCard title="First 5 Actions" promptMessage="abc" response={{ action: [], explanation: 'I do this' }} />

                        </div>

                    </div>
                </div>
            </dialog>
        </div>
    )
}
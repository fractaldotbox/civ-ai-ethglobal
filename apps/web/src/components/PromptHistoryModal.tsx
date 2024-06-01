import { useState } from "react"
import Button from "./Button"
import Image from 'next/image'
import { asPlayerKey } from "@repo/engine"


export const PromptCard = ({ title, promptMessage }: { title: string, promptMessage: string }) => {
    return (

        <div className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
                {title}
            </div>
            <div className="collapse-content">
                <p> {promptMessage}</p>
            </div>
        </div>
    )

}

export default ({ playerKeys, initPrompts }: { playerKeys: string[], initPrompts: string[] }) => {

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
                        <h3 className="font-bold text-xl py-2">Base Prompt</h3>
                        <div className="w-full flex justify-center flex-col">
                            <PromptCard title="test" promptMessage="abc" />
                            <PromptCard title="test" promptMessage="abc" />
                            <PromptCard title="test" promptMessage="abc" />
                        </div>

                    </div>
                </div>
            </dialog>
        </div>
    )
}
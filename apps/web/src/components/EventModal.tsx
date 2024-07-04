import { GameEvent } from "@repo/engine"
import Button from "./Button"
import Image from 'next/image'

// import imageStart from '../../public/civai1.jpg'

export default ({ event }: { event: GameEvent }) => {
    const { title, description, imageSrc } = event;
    return (
        // <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>open modal</button>
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box w-11/12 max-w-5xl flex flex-col">
                <h3 className="font-bold text-xl pb-4">{title}</h3>
                <div className="w-full flex justify-center">
                    {imageSrc && (
                        <Image
                            src={imageSrc}
                            width={700}
                            height={600}
                            alt="Picture of the author"
                        />
                    )}
                </div>

                <p className="py-2">{description}</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <Button onClick={() => document.getElementById('my_modal_3').close()}>OK</Button>
                    </form>
                </div>



            </div>
        </dialog>
    )
}
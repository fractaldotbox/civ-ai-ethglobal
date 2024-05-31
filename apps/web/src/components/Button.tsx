import React from "react"

export default ({ onClick, children }: { onClick: any, children: React.ReactNode }) => {
    return (
        <button className="btn bg-blue-500 text-white" onClick={onClick} >{children}</button>
    )
}
import React from 'react'

const Badge = (props) => {
    return (
        <span
            className={`flex items-center justify-center py-1 px-3 capitalize rounded-full text-sm shadow-md
            ${props.status === "pending" ? "bg-[var(--bg-primary)] text-white" : ""}
            ${props.status === "confirm" ? "bg-blue-500 text-white" : ""}
            ${props.status === "delivered" ? "bg-green-500 text-white" : ""}
            ${!["pending", "confirm", "delivered"].includes(props.status) ? "bg-gray-300 text-gray-700" : ""}
        `}
        >
            {props.status}
        </span>

    )
}

export default Badge

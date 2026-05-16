import * as React from "react"

const Input = React.forwardRef(({ className = "", type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={`input ${className}`.trim()}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
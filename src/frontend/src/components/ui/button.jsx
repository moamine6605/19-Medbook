import * as React from "react"

const Button = React.forwardRef(({ className = "", variant = "primary", size = "default", fullWidth, ...props }, ref) => {
    const baseClass = "btn"
    const variantClass = `btn-${variant}`
    const widthClass = fullWidth ? "btn-full" : ""

    return (
        <button
            className={`${baseClass} ${variantClass} ${widthClass} ${className}`.trim()}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }
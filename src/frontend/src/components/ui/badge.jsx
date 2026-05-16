import * as React from "react"

function Badge({ className = "", variant = "default", ...props }) {
    const variantClass = `badge-${variant}`
    return (
        <div className={`badge ${variantClass} ${className}`.trim()} {...props} />
    )
}

export { Badge }
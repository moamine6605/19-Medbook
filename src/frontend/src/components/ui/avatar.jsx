import * as React from "react"

const Avatar = React.forwardRef(({ className = "", name = "User", size = "md", ...props }, ref) => {
    const sizeClass = `avatar-${size}`
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    return (
        <div ref={ref} className={`avatar ${sizeClass} ${className}`.trim()} {...props}>
            {initials}
        </div>
    )
})
Avatar.displayName = "Avatar"

export { Avatar }
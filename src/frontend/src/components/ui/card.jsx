import * as React from "react"

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
    <div ref={ref} className={`card ${className}`.trim()} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className = "", ...props }, ref) => (
    <div ref={ref} className={`card-header flex flex-col gap-2 ${className}`.trim()} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className = "", ...props }, ref) => (
    <h3 ref={ref} className={`card-title ${className}`.trim()} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef(({ className = "", ...props }, ref) => (
    <div ref={ref} className={`card-content ${className}`.trim()} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
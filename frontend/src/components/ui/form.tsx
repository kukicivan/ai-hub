import * as React from "react"

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export function Form({ children, ...props }: FormProps) {
  return (
    <form {...props} className={"space-y-6 " + (props.className || "")}>{children}</form>
  )
}

export function FormField({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={"space-y-2 " + className}>{children}</div>
}

export function FormLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

export function FormMessage({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-sm text-red-600">{children}</p>
}

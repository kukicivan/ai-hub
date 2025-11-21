import * as React from "react"

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block text-left">
      <span onClick={() => setOpen((o) => !o)}>{trigger}</span>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownMenuItem({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

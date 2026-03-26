import React from "react";

interface DropdownMenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef, contentRef }}>
      <div className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLDivElement, DropdownMenuTriggerProps>(
  ({ children, onClick }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

    const handleClick = (e: React.MouseEvent) => {
      onClick?.(e);
      context.setIsOpen(!context.isOpen);
    };

    return (
      <div ref={ref} onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

interface DropdownMenuContentProps {
  children: React.ReactNode;
  align?: "end" | "start";
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, align = "start" }, ref) => {
    const context = React.useContext(DropdownMenuContext);
    if (!context) throw new Error("DropdownMenuContent must be used within DropdownMenu");

    if (!context.isOpen) return null;

    return (
      <div
        ref={ref}
        className={`absolute z-50 mt-2 min-w-[160px] rounded-md border bg-white shadow-lg ${
          align === "end" ? "right-0" : "left-0"
        }`}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export function DropdownMenuItem({ children, onClick, className }: DropdownMenuItemProps) {
  return (
    <div
      className={`flex cursor-pointer items-center px-3 py-2 text-sm hover:bg-gray-100 ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
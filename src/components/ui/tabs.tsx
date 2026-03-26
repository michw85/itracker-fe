import React, { useState } from "react";

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ 
  defaultValue, 
  value: controlledValue, 
  onValueChange, 
  children, 
  className = "" 
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || "");
  
  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : uncontrolledValue;
  
  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  // Передаем контекст дочерним элементам
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TabsList || child.type === TabsContent) {
        return React.cloneElement(child as React.ReactElement<any>, {
          activeValue,
          onValueChange: handleValueChange,
        });
      }
    }
    return child;
  });
  
  return <div className={className}>{childrenWithProps}</div>;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
  onValueChange?: (value: string) => void;
}

export function TabsList({ children, className = "", activeValue, onValueChange }: TabsListProps) {
  // Передаем контекст триггерам
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === TabsTrigger) {
      return React.cloneElement(child as React.ReactElement<any>, {
        activeValue,
        onValueChange,
      });
    }
    return child;
  });
  
  return (
    <div className={`flex gap-2 border-b ${className}`}>
      {childrenWithProps}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
  onValueChange?: (value: string) => void;
}

export function TabsTrigger({ 
  value, 
  children, 
  className = "", 
  activeValue, 
  onValueChange 
}: TabsTriggerProps) {
  const isActive = activeValue === value;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? "border-b-2 border-black text-black" 
          : "text-gray-500 hover:text-gray-700"
      } ${className}`}
      onClick={() => onValueChange?.(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeValue?: string;
}

export function TabsContent({ value, children, className = "", activeValue }: TabsContentProps) {
  if (activeValue !== value) return null;
  return <div className={className}>{children}</div>;
}
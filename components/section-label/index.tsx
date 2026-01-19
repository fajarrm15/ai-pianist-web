import { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function SectionLabel({ children, icon }: SectionLabelProps) {
  return (
    <p className="text-sm font-medium text-stone-500 mb-3 flex items-center gap-2">
      {icon && <span className="text-mint-500">{icon}</span>}
      {children}
    </p>
  );
}

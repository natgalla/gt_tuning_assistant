"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { titleCase } from "@/lib/utils";

interface SelectorProps {
  value: string;
  availableTypes: string[];
  orderArray: string[];
  onChange: (value: string | null) => void;
}

export function SuspensionSelector({
  value,
  availableTypes,
  orderArray = [],
  onChange,
}: SelectorProps) {
  const ordered = orderArray.filter((t) => availableTypes.includes(t));

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">{titleCase(value)}</SelectTrigger>
      <SelectContent>
        {ordered.map((type) => (
          <SelectItem key={type} value={type}>
            {titleCase(type)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

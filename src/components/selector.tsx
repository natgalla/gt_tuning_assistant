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
  formatLabel?: (value: string) => string;
}

export function SuspensionSelector({
  value,
  availableTypes,
  orderArray = [],
  onChange,
  formatLabel = titleCase,
}: SelectorProps) {
  const ordered = orderArray.filter((t) => availableTypes.includes(t));

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">{formatLabel(value)}</SelectTrigger>
      <SelectContent>
        {ordered.map((type) => (
          <SelectItem key={type} value={type}>
            {formatLabel(type)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

export interface CatalogCar {
  id: number;
  name: string;
  manufacturer: string;
  year: number | null;
  drivetrain: string;
  weight: number | null;
  horsePower: number | null;
}

interface CarSelectorProps {
  value: CatalogCar | null;
  onSelect: (car: CatalogCar | null) => void;
}

function filterCar(car: CatalogCar, query: string): boolean {
  const q = query.toLowerCase();
  const searchText = `${car.manufacturer} ${car.name}`.toLowerCase();
  return searchText.includes(q);
}

export function CarSelector({ value, onSelect }: CarSelectorProps) {
  const [cars, setCars] = useState<CatalogCar[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("/api/cars?fields=catalog")
      .then((res) => res.json())
      .then((data: CatalogCar[]) => setCars(data))
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    if (!inputValue) return cars;
    return cars.filter((car) => filterCar(car, inputValue));
  }, [cars, inputValue]);

  // Group filtered results by manufacturer
  const grouped = useMemo(() => {
    const map = new Map<string, CatalogCar[]>();
    for (const car of filtered) {
      const group = map.get(car.manufacturer) || [];
      group.push(car);
      map.set(car.manufacturer, group);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <Combobox.Root<CatalogCar>
      value={value}
      onValueChange={(val) => onSelect(val)}
      onInputValueChange={(val, details) => {
        setInputValue(val);
        // Clear selection when user types after selecting (backspacing etc)
        if (details.reason === "input-change" && value) {
          onSelect(null);
        }
      }}
      itemToStringLabel={(car) => `${car.manufacturer} ${car.name}`}
      isItemEqualToValue={(a, b) => a.id === b.id}
      autoComplete="none"
      autoHighlight
    >
      <div className="relative">
        <Combobox.InputGroup
          className={cn(
            "flex items-center h-8 w-full rounded-lg border border-input bg-transparent text-base transition-colors md:text-sm",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
            "dark:bg-input/30",
          )}
        >
          <Combobox.Input
            placeholder="Search cars..."
            className="h-full flex-1 min-w-0 bg-transparent px-2.5 py-1 outline-none placeholder:text-muted-foreground"
          />
          <Combobox.Clear
            className="mr-1 p-0.5 rounded hover:bg-muted text-muted-foreground"
          >
            <XIcon className="size-3.5" />
          </Combobox.Clear>
        </Combobox.InputGroup>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="z-50">
          <Combobox.Popup className="max-h-60 w-(--anchor-width) overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
            <Combobox.List>
              {grouped.length === 0 ? (
                <div className="px-2 py-4 text-sm text-center text-muted-foreground">
                  No cars found
                </div>
              ) : (
                grouped.map(([manufacturer, items]) => (
                  <Combobox.Group key={manufacturer}>
                    <Combobox.GroupLabel className="px-2 py-1 text-xs font-medium text-muted-foreground sticky top-0 bg-popover">
                      {manufacturer}
                    </Combobox.GroupLabel>
                    {items.map((car) => (
                      <Combobox.Item
                        key={car.id}
                        value={car}
                        className="flex items-center gap-2 cursor-default rounded-md px-2 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                      >
                        <span className="flex-1 truncate">{car.name}</span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {car.drivetrain}
                        </span>
                      </Combobox.Item>
                    ))}
                  </Combobox.Group>
                ))
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

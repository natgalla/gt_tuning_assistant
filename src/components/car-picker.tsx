"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Car {
  id: number;
  name: string;
  manufacturer: string;
  year: number | null;
  drivetrain: string;
}

export function CarPicker({ cars }: { cars: Car[] }) {
  return (
    <div className="grid gap-3">
      {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.id}`}>
          <Card className="active:bg-accent transition-colors">
            <CardContent className="flex items-center justify-between py-4 px-4">
              <div className="min-w-0">
                <p className="font-medium text-sm leading-tight">
                  {car.manufacturer} {car.name}
                </p>
                {car.year && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {car.year}
                  </p>
                )}
              </div>
              <Badge variant="secondary" className="shrink-0 ml-3">
                {car.drivetrain}
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

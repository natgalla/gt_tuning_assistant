import { prisma } from "@/lib/prisma";
import { CarPicker } from "@/components/car-picker";

export default async function HomePage() {
  const cars = await prisma.car.findMany({ orderBy: { id: "asc" } });

  return (
    <main className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-xl font-bold mb-1">GT7 Tuning Assistant</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Select a car to start tuning
      </p>
      <CarPicker cars={cars} />
    </main>
  );
}

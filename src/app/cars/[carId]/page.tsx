import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TuneEditor } from "@/components/tune-editor";
import { UserMenu } from "@/components/user-menu";
import { ChevronLeft } from "lucide-react";

export default async function CarTunePage({
  params,
}: {
  params: Promise<{ carId: string }>;
}) {
  const { carId } = await params;
  const id = parseInt(carId, 10);
  if (isNaN(id)) notFound();

  const car = await prisma.car.findUnique({ where: { id } });
  if (!car) notFound();

  const configs = await prisma.tuneConfig.findMany({
    where: { carId: id },
    orderBy: { id: "asc" },
  });

  const tunes = await prisma.tune.findMany({
    where: { carId: id },
    orderBy: { createdAt: "desc" },
  });

  const serializedTunes = tunes.map((t) => ({
    ...t,
    createdAt: t.createdAt.toISOString(),
    updatedAt: undefined,
  }));

  return (
    <main className="mx-auto max-w-lg px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <Link
          href="/"
          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3 w-3 mr-0.5" />
          Back
        </Link>
        <UserMenu />
      </div>
      <TuneEditor
        car={car}
        configs={configs}
        savedTunes={serializedTunes}
      />
    </main>
  );
}

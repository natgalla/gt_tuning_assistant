"use client";

import { TuneEditor } from "@/components/tune-editor";
import { UserMenu } from "@/components/user-menu";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">GT7 Tuning Assistant</h1>
        <UserMenu />
      </div>
      <TuneEditor car={null} configs={[]} savedTunes={[]} />
    </main>
  );
}

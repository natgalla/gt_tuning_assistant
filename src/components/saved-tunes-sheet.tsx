"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { SavedTune } from "@/components/tune-editor";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const SUSPENSION_LABELS: Record<string, string> = {
  STOCK: "Stock",
  STREET: "Street",
  SPORT: "Sport",
  HEIGHT_ADJUSTABLE_SPORT: "H.A. Sport",
  FULLY_CUSTOMIZABLE: "Fully Custom",
};

interface SavedTunesSheetProps {
  tunes: SavedTune[];
  onLoad: (tune: SavedTune) => void;
  onDelete: (tuneId: string) => void;
  disabled?: boolean;
}

export function SavedTunesSheet({ tunes, onLoad, onDelete, disabled }: SavedTunesSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" disabled={disabled} />}
      >
        Load{tunes.length > 0 && ` (${tunes.length})`}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[70vh]">
        <SheetHeader>
          <SheetTitle>Saved Tunes</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto mt-4">
          {tunes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No saved tunes yet
            </p>
          ) : (
            <div className="space-y-2">
              {tunes.map((tune) => (
                <div
                  key={tune.id}
                  className="flex items-center justify-between border rounded-lg px-3 py-2"
                >
                  <button
                    type="button"
                    className="flex-1 text-left min-w-0"
                    onClick={() => {
                      onLoad(tune);
                      setOpen(false);
                    }}
                  >
                    <p className="text-sm font-medium truncate">{tune.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {SUSPENSION_LABELS[tune.suspensionType] ?? tune.suspensionType}
                      {" \u00B7 "}
                      {new Date(tune.createdAt).toLocaleDateString()}
                    </p>
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 ml-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(tune.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/auth-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground truncate max-w-[160px]">
          {user.displayName ?? user.email}
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          Log Out
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Log In
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>
        <AuthForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

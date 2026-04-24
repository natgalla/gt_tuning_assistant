"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/auth-form";
import { Menu } from "@base-ui/react/menu";
import { UserCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const initials = user
    ? (user.displayName ?? user.email).charAt(0).toUpperCase()
    : null;

  return (
    <>
      <Menu.Root>
        <Menu.Trigger
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-sm font-medium text-foreground outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          {user ? (
            initials
          ) : (
            <UserCircle className="h-5 w-5" />
          )}
        </Menu.Trigger>

        <Menu.Portal>
          <Menu.Positioner align="end" sideOffset={4}>
            <Menu.Popup className="z-50 min-w-[140px] rounded-lg border bg-popover p-1 text-popover-foreground shadow-md outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
              {user ? (
                <>
                  <Menu.Item
                    className="flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("custom:open-saved-tunes")
                      )
                    }
                  >
                    Saved Tunes
                  </Menu.Item>
                  <Menu.Item
                    className="flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                    onClick={() => logout()}
                  >
                    Log Out
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item
                  className="flex w-full cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent focus:bg-accent"
                  onClick={() => setDialogOpen(true)}
                >
                  Log In
                </Menu.Item>
              )}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account</DialogTitle>
          </DialogHeader>
          <AuthForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}

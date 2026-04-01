"use client"

import { InfoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


type InformationDialogProps = {
  title: string
  description: string
  trigger?: React.ReactNode
} & React.ComponentProps<typeof Dialog>
export function InformationDialog({
  title,
  description,
  trigger = <Button size="icon" variant="secondary"><InfoIcon /></Button>,
  children,
  ...props
}: InformationDialogProps) {
  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="-mr-1.5 pr-1.5 overflow-y-auto [scrollbar-gutter:stable]">
          {children}
        </div>
        {/* <div className="flex justify-end w-full"> */}
        <DialogClose asChild>
          <Button variant="secondary">Schließen</Button>
        </DialogClose>
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
}

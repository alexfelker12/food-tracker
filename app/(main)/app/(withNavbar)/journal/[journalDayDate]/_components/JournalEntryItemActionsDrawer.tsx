"use client"

import { useState } from "react";

import { type IntakeTime } from "@/generated/prisma/client";
import { IntakeTime as intakeTimeEnum } from "@/generated/prisma/enums"

import { CheckIcon, EllipsisVerticalIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer"
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";


type JournalEntryItemActionsDrawerProps = {
  currentIntakeTime: IntakeTime
  journalEntryId: string
  label?: string
}
export function JournalEntryItemActionsDrawer({ currentIntakeTime, journalEntryId, label }: JournalEntryItemActionsDrawerProps) {
  const [open, setOpen] = useState(false)

  const handleRetracking = (intakeTime: IntakeTime) => {
    console.log("retracking for:", intakeTime)
  }

  const handleMove = (intakeTime: IntakeTime) => {
    console.log("moved to:", intakeTime)
  }

  const handleEdit = () => {
    console.log("editing entry:", journalEntryId)
  }

  const handleDelete = () => {
    console.log("deleting entry:", journalEntryId)
  }


  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon-sm"><EllipsisVerticalIcon /></Button>
      </DrawerTrigger>
      <DrawerContent>
        {/* label */}
        <DrawerHeader>
          <DrawerTitle className="text-lg">{label || "Optionen"}</DrawerTitle>
          <DrawerDescription className="sr-only">Bearbeite, lösche oder tracke diesen Eintrag erneut</DrawerDescription>
        </DrawerHeader>

        {/* retrack | move */}
        <div className="flex flex-col gap-2 p-4 pt-0">

          {/* retrack */}
          <NestedDrawer>
            <DrawerTrigger asChild><Button variant="outline" className="flex-1">Erneut tracken</Button></DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-lg">Erneut tracken für...</DrawerTitle>
                <DrawerDescription className="text-base">Wähle eine Tageszeit, zu der dieser Eintrag für heute erneut getrackt werden soll</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="pt-0">
                <DrawerClose asChild>
                  <Button variant="outline" onClick={() => handleRetracking(intakeTimeEnum.BREAKFAST)}>Frühstück</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={() => handleRetracking(intakeTimeEnum.LUNCH)}>Mittagessen</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={() => handleRetracking(intakeTimeEnum.DINNER)}>Abendessen</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={() => handleRetracking(intakeTimeEnum.SNACKS)}>Snacks</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </NestedDrawer>

          {/* move */}
          <NestedDrawer>
            <DrawerTrigger asChild><Button variant="outline" className="flex-1">Verschieben</Button></DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-lg">Verschieben nach...</DrawerTitle>
                <DrawerDescription className="text-base">Wähle eine Tageszeit, zu der dieser Eintrag verschoben werden soll</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter className="pt-0">
                <DrawerClose asChild>
                  <Button
                    variant={currentIntakeTime === intakeTimeEnum.BREAKFAST ? "secondary" : "outline"}
                    disabled={currentIntakeTime === intakeTimeEnum.BREAKFAST}
                    onClick={() => {
                      if (currentIntakeTime === intakeTimeEnum.BREAKFAST) return;
                      handleMove(intakeTimeEnum.BREAKFAST)
                    }}
                  >
                    {currentIntakeTime === intakeTimeEnum.BREAKFAST && <CheckIcon />} Frühstück
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    variant={currentIntakeTime === intakeTimeEnum.LUNCH ? "secondary" : "outline"}
                    disabled={currentIntakeTime === intakeTimeEnum.LUNCH}
                    onClick={() => {
                      if (currentIntakeTime === intakeTimeEnum.LUNCH) return;
                      handleMove(intakeTimeEnum.LUNCH)
                    }}
                  >
                    {currentIntakeTime === intakeTimeEnum.LUNCH && <CheckIcon />} Mittagessen
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    variant={currentIntakeTime === intakeTimeEnum.DINNER ? "secondary" : "outline"}
                    disabled={currentIntakeTime === intakeTimeEnum.DINNER}
                    onClick={() => {
                      if (currentIntakeTime === intakeTimeEnum.DINNER) return;
                      handleMove(intakeTimeEnum.DINNER)
                    }}
                  >
                    {currentIntakeTime === intakeTimeEnum.DINNER && <CheckIcon />} Abendessen
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button
                    variant={currentIntakeTime === intakeTimeEnum.SNACKS ? "secondary" : "outline"}
                    disabled={currentIntakeTime === intakeTimeEnum.SNACKS}
                    onClick={() => {
                      if (currentIntakeTime === intakeTimeEnum.SNACKS) return;
                      handleMove(intakeTimeEnum.SNACKS)
                    }}
                  >
                    {currentIntakeTime === intakeTimeEnum.SNACKS && <CheckIcon />} Snacks
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </NestedDrawer>

        </div>

        <div className="px-4 w-full"><Separator /></div>

        {/* edit | delete */}
        <DrawerFooter>
          {/* edit */}
          <Button variant="outline" className="flex-1" onClick={handleEdit}><PencilIcon /> Bearbeiten</Button>
          {/* delete */}
          <NestedDrawer>
            <DrawerTrigger asChild>
              <Button variant="destructive" className="flex-1"><Trash2Icon /> Löschen</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="text-lg">Bist du dir sicher?</DrawerTitle>
                <DrawerDescription className="text-base">Du kannst diesen Eintrag nicht wiederherstellen</DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="destructive" className="flex-1" onClick={handleDelete}><Trash2Icon /> Bestätigen</Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1"><XIcon /> Abbrechen</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </NestedDrawer>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

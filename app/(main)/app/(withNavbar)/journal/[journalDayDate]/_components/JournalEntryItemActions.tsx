"use client"

import { type IntakeTime } from "@/generated/prisma/client";
import { IntakeTime as intakeTimeEnum } from "@/generated/prisma/enums"

import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


type JournalEntryItemActionsProps = {
  currentIntakeTime: IntakeTime
  journalEntryId: string
}
export function JournalEntryItemActions({ currentIntakeTime, journalEntryId }: JournalEntryItemActionsProps) {

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm"><EllipsisVerticalIcon /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">

        {/* retrack for different intake time */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Nochmal tracken</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onSelect={() => handleRetracking(intakeTimeEnum.BREAKFAST)}>Frühstück</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleRetracking(intakeTimeEnum.LUNCH)}>Mittagessen</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleRetracking(intakeTimeEnum.DINNER)}>Abendessen</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleRetracking(intakeTimeEnum.SNACKS)}>Snacks</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* move entry to different intake time */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Verschieben nach</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={currentIntakeTime}
                onValueChange={(newTime) => handleMove(newTime as IntakeTime)}
              >
                <DropdownMenuRadioItem value={intakeTimeEnum.BREAKFAST}
                  disabled={currentIntakeTime === intakeTimeEnum.BREAKFAST}
                >Frühstück</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={intakeTimeEnum.LUNCH}
                  disabled={currentIntakeTime === intakeTimeEnum.LUNCH}
                >Mittagessen</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={intakeTimeEnum.DINNER}
                  disabled={currentIntakeTime === intakeTimeEnum.DINNER}
                >Abendessen</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value={intakeTimeEnum.SNACKS}
                  disabled={currentIntakeTime === intakeTimeEnum.SNACKS}
                >Snacks</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* edit entry data (other portion, amount of portion, ...) */}
        <DropdownMenuItem onSelect={handleEdit}><PencilIcon /> Bearbeiten</DropdownMenuItem>

        {/* delete entry from journal (day) */}
        <DropdownMenuItem onSelect={handleDelete} variant="destructive"><Trash2Icon /> Löschen</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { UseMutationResult } from "@tanstack/react-query";

import { NutritionResultModel } from "@/generated/prisma/models";

import { LayoutDashboardIcon } from "lucide-react";

import { FirstNutritionResultDisplay } from "@/components/profile/FirstNutritionResultDisplay";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


type ProfileCreateSuccessProps = Pick<UseMutationResult<NutritionResultModel>, "data">
export function ProfileCreateSuccess({ data }: ProfileCreateSuccessProps) {
  const [open, setOpen] = useState(true)

  const router = useRouter()

  useEffect(() => {
    router.prefetch("/app")
  }, [])

  return (
    <AlertDialog open={open && !!data} onOpenChange={setOpen}>
      <AlertDialogContent overlayClassNames="backdrop-blur-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Du bist nun startklar!</AlertDialogTitle>
          <AlertDialogDescription>
            Dein Profil wurde erfolgreich erstellt. <br />
            Deine Fitness-Reise beginnt mit diesen Werten:
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* nutrition result data display for user */}
        <FirstNutritionResultDisplay
          caloryGoal={data?.caloryGoal}
          amountFats={data?.amountFats}
          amountCarbs={data?.amountCarbs}
          amountProtein={data?.amountProtein}
        />

        <div>
          <span className="text-muted-foreground text-sm">Du kannst dein Profil auch noch im Nachhinein anpassen. Um mit der App zu starten, gehe</span>
        </div>

        {/* close dialog and link to dashboard */}
        <Button onClick={() => {
          setOpen(false)
          setTimeout(() => router.push("/app"), 210) // let dialog close before going to /app
        }}>
          <LayoutDashboardIcon /> Zum Dashboard
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}

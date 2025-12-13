"use client"

import { useState } from "react";

import { UserProfileType } from "@/orpc/router/profile/get";

import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";

import { PencilIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { UserProfileContext } from "./UserProfileContext";
import { UserProfileData } from "./UserProfileData";
import { UserProfileEdit } from "./UserProfileEdit";


export type UserProfileViewProps = {
  profile: UserProfileType
}
export function UserProfileView({ profile }: UserProfileViewProps) {
  const [editMode, setEditMode] = useState(false)

  const userName = profile.user.displayUsername || profile.user.name

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        editMode,
        queryKey: orpc.profile.get.queryKey(),
        cancelEdit: () => setEditMode(false)
      }}
    >
      <Card className="py-4 w-full">
        <CardHeader className="px-4">
          <CardTitle className="text-lg leading-none">{userName}</CardTitle>
          <CardDescription className="text-base">Dein momentanes Profil</CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" onClick={() => setEditMode((prev) => !prev)}>
              {editMode
                ? <><XIcon /> <span>Abbrechen</span></>
                : <><PencilIcon /> <span>Bearbeiten</span></>
              }
            </Button>
          </CardAction>
        </CardHeader>

        {editMode
          ? <UserProfileEdit />
          : <UserProfileData />
        }

      </Card>
    </UserProfileContext.Provider>
  );
}

interface ProfileDataSectionProps extends React.ComponentProps<"section"> {
  label: string
  listingClassNames?: string
}
export function ProfileDataSection({
  label, listingClassNames,
  className, children, ...props
}: ProfileDataSectionProps) {
  return (
    <section
      className={cn(
        "space-y-2",
        className
      )}
      {...props}
    >
      <div>
        <span>{label}</span>
        <Separator />
      </div>
      <div className={cn(
        "flex flex-col gap-2 text-sm",
        listingClassNames
      )}>
        {children}
      </div>
    </section>
  );
}

interface ProfileDataProps extends React.ComponentProps<"div"> {

}
export function ProfileData({ className, ...props }: ProfileDataProps) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4 *:first:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

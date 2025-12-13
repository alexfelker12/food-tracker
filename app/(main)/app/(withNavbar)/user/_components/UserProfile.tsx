"use client"

import { useSuspenseQuery } from "@tanstack/react-query";

import { orpc } from "@/lib/orpc";
import { UserProfileView } from "./UserProfileView";


export function UserProfile() {
  const { data: profile } = useSuspenseQuery(orpc.profile.get.queryOptions())

  if (!profile) return <span>No Profile</span> //TODO no profile found means user didn't go through onboarding. Show dialog with notice and link to onboard?

  return (
    <UserProfileView profile={profile} />
  );
}

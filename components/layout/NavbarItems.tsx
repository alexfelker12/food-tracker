"use client"

import { APP_BASE_URL } from "@/lib/constants";

import { HomeIcon, NotebookPenIcon, NotebookTextIcon, PlusIcon } from "lucide-react";

import { NavbarItem } from "./NavbarItem";
import { NavbarItemCreate } from "./NavbarItemCreate";
import { NavbarItemTrack } from "./NavbarItemTrack";

//TODO: track and create components are badly adapted from NavbarItem -> Fix/Optimize
//TODO: ^ encapsulate trigger appearance and render Link/DrawerTrigger by prop

export function NavbarItems() {
  return (
    <>
      <NavbarItem label="Start" icon={HomeIcon}
        href={APP_BASE_URL}
      />
      <NavbarItem label="Tagebuch" icon={NotebookTextIcon}
        href={APP_BASE_URL + "/journal" as `/${string}`}
      />
      {/* <NavbarItem label="Eintrag" icon={NotebookPenIcon} isPrimary
        href={APP_BASE_URL + "/track" as `/${string}`}
      /> */}
      <NavbarItemTrack label="Eintrag" icon={NotebookPenIcon} isPrimary
        href={APP_BASE_URL + "/track" as `/${string}`}
      />
      {/* <NavbarItem label="Erstellen" icon={PlusIcon}
        href={APP_BASE_URL + "/create" as `/${string}`}
      /> */}
      <NavbarItemCreate label="Erstellen" icon={PlusIcon}
        href={APP_BASE_URL + "/create" as `/${string}`}
      />
    </>
  );
}

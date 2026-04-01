"use client"

import { ActivityLevel } from "@/generated/prisma/enums";

import { activityLevelLabels } from "@/schemas/labels/profileSchemaLabels";

import { Separator } from "@/components/ui/separator";


type ActivityLevelInformationProps = {
  activityLevel: ActivityLevel
}
export function ActivityLevelInformation({ activityLevel }: ActivityLevelInformationProps) {
  const InfoComponent = informationRegistry[activityLevel]
  return <InfoComponent />;
}

//* registry format for information sections to have more fine grained info contents 
function VeryLow() {
  return (
    <div className="space-y-1 text-foreground/80">
      <div className="">
        <p className="text-foreground capitalize">{activityLevelLabels["VERY_LOW"]}</p>
        <Separator />
      </div>
      <ul className="pl-4.5 text-sm list-disc list-outside">
        <li>Bürojob oder sitzende Tätigkeit</li>
        <li>Weniger als ~5.000 Schritte/Tag</li>
        <li>0-1 leichte Trainingseinheit pro Woche</li>
      </ul>
    </div>
  );
}

function Low() {
  return (
    <div className="space-y-1 text-foreground/80">
      <div className="">
        <p className="text-foreground capitalize">{activityLevelLabels["LOW"]}</p>
        <Separator />
      </div>
      <ul className="pl-4.5 text-sm list-disc list-outside">
        <li>Bürojob</li>
        <li>1-2 Trainingstage pro Woche</li>
        <span className="-ml-4.5">ODER</span>
        <li>5.000-7.000 Schritte/Tag ohne Training</li>
      </ul>
    </div>
  );
}

function Medium() {
  return (
    <div className="space-y-1 text-foreground/80">
      <div className="">
        <p className="text-foreground capitalize">{activityLevelLabels["MEDIUM"]}</p>
        <Separator />
      </div>
      <ul className="pl-4.5 text-sm list-disc list-outside">
        <li>Bürojob + 4 Trainingstage</li>
        <span className="-ml-4.5">ODER</span>
        <li>Aktiver Alltag (viel Gehen, z. B. Einzelhandel, Pflege) + 0-2 Trainingstage</li>
        <li>~7.000-10.000 Schritte/Tag</li>
      </ul>
    </div>
  );
}

function High() {
  return (
    <div className="space-y-1 text-foreground/80">
      <div className="">
        <p className="text-foreground capitalize">{activityLevelLabels["HIGH"]}</p>
        <Separator />
      </div>
      <ul className="pl-4.5 text-sm list-disc list-outside">
        <li>Bürojob + 4-5 intensive Trainingstage</li>
        <span className="-ml-4.5">ODER</span>
        <li>Körperlich aktiver Beruf + 2-3 Trainingstage</li>
        <li>&gt;10.000 Schritte/Tag</li>
      </ul>
    </div>
  );
}

function VeryHigh() {
  return (
    <div className="space-y-1 text-foreground/80">
      <div className="">
        <p className="text-foreground capitalize">{activityLevelLabels["VERY_HIGH"]}</p>
        <Separator />
      </div>
      <ul className="pl-4.5 text-sm list-disc list-outside">
        <li>Körperlich fordernder Beruf (Handwerk, Bau, Logistik etc.)</li>
        <li>+ 4-6 Trainingstage</li>
        <span className="-ml-4.5">ODER</span>
        <li>Leistungsorientiertes Training mit hoher Intensität</li>
      </ul>
    </div>
  );
}

const informationRegistry: Record<
  ActivityLevel,
  React.ComponentType
> = {
  VERY_LOW: VeryLow,
  LOW: Low,
  MEDIUM: Medium,
  HIGH: High,
  VERY_HIGH: VeryHigh,
}

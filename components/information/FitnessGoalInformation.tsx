"use client"

import { FitnessGoal } from "@/generated/prisma/enums";


type FitnessGoalInformationProps = {
  fitnessGoal: FitnessGoal
}
export function FitnessGoalInformation({ fitnessGoal }: FitnessGoalInformationProps) {
  const InfoComponent = informationRegistry[fitnessGoal]
  return <InfoComponent />;
}

//* registry format for information sections to have more fine grained info contents 
function QuicklyLoseWeight() {
  return (
    <div className="flex flex-col gap-2 text-foreground/80">
      <p>
        Deutliche Gewichtsreduktion in möglichst kurzer Zeit.
        Größeres Kaloriendefizit, stärkerer Fokus auf Protein und Training zur Muskelerhaltung.
        Nur für kurzfristige Phasen geeignet!
      </p>

      <p>
        Empfehlungsdauer: 4-8 Wochen
      </p>

      <p>
        Ziel ist eine Gewichtsreduktion von etwa 0,7-1,0 % des Körpergewichts pro Woche durch ein deutliches Kaloriendefizit. Diese Rate ist effektiv, aber belastender für Regeneration und Training und daher nur für kurze Phasen geeignet.
      </p>
    </div>
  );
}

function LoseWeight() {
  return (
    <div className="flex flex-col gap-2 text-foreground/80">
      <p>
        Kontinuierliche, nachhaltige Gewichtsreduktion mit moderatem Defizit.
        Gute Balance aus Fettabbau, Leistungsfähigkeit und Alltagstauglichkeit.
        Für die meisten Personen die sinnvollste Option.
        Standard-Cut.
      </p>

      <p>
        Empfehlungsdauer: 8-24 Wochen
      </p>

      <p>
        Angestrebt wird ein Verlust von etwa 0,4-0,7 % des Körpergewichts pro Woche. Das ermöglicht nachhaltigen Fettabbau bei guter Trainingsleistung und ist für die meisten Personen langfristig am sinnvollsten.
      </p>
    </div>
  );
}

function Maintain() {
  return (
    <div className="flex flex-col gap-2 text-foreground/80">
      <p>
        Kalorien auf Erhaltungsniveau mit Fokus auf Training und Protein.
        Ziel ist Muskelaufbau bei gleichzeitiger Reduktion von Körperfett über Zeit.
        Gewicht kann stabil bleiben oder sich leicht verändern.
      </p>

      <p>
        Empfehlungsdauer: mind. 3 Monate
      </p>

      <p>
        Das Körpergewicht bleibt weitgehend stabil (-0,2 % bis +0,2 % pro Woche). Ziel ist es, über Training und ausreichende Proteinzufuhr Muskelmasse aufzubauen und den Körperfettanteil langsam zu optimieren.
      </p>
    </div>
  );
}

function GainWeight() {
  return (
    <div className="flex flex-col gap-2 text-foreground/80">
      <p>
        Leichter Kalorienüberschuss für kontinuierlichen Muskelaufbau.
        Minimiert unnötige Fettzunahme durch kontrolliertes Tempo.
        Standard-Bulk.
      </p>

      <p>
        Empfehlungsdauer: 3-6 Monate
      </p>

      <p>
        Der Fokus liegt auf einem kontrollierten Aufbau mit etwa 0,2-0,4 % Gewichtszunahme pro Woche. So wird Muskelaufbau unterstützt, während unnötige Fettzunahme begrenzt bleibt.
      </p>
    </div>
  );
}

function QuicklyGainWeight() {
  return (
    <div className="flex flex-col gap-2 text-foreground/80">
      <p>
        Deutlicher Kalorienüberschuss für schnellen Masseaufbau.
        Höheres Risiko für zusätzliche Fettzunahme.
        Nur für kurzfristige Phasen geeignet.
      </p>

      <p>
        Empfehlungsdauer: 6-10 Wochen
      </p>

      <p>
        Hier wird eine Zunahme von etwa 0,4-0,7 % pro Woche angestrebt. Das beschleunigt den Masseaufbau, erhöht jedoch das Risiko für zusätzliche Fettzunahme und ist daher nur für zeitlich begrenzte Phasen geeignet.
      </p>
    </div>
  );
}

const informationRegistry: Record<
  FitnessGoal,
  React.ComponentType
> = {
  QUICKLY_LOSE_WEIGHT: QuicklyLoseWeight,
  LOSE_WEIGHT: LoseWeight,
  MAINTAIN: Maintain,
  GAIN_WEIGHT: GainWeight,
  QUICKLY_GAIN_WEIGHT: QuicklyGainWeight,
}

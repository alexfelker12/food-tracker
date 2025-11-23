import { CreateFoodForm } from "@/components/food/CreateFoodForm";

export default function Page() {
  return (
    <main className="flex justify-center h-full">
      <div className="flex flex-col gap-6 p-4">
        <div className="space-y-1">
          <h1 className="font-semibold text-xl">Lebesmittel erstellen</h1>
          <p className="text-muted-foreground text-sm">Gebe die Informationen eines Lebensmittel an, um dieses zu deinem Tagebuch hinzufügen zu können</p>
        </div>
        <CreateFoodForm />
      </div>
    </main>
  );
}

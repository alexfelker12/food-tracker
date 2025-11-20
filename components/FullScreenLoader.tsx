import { Spinner } from "@/components/ui/spinner";

export function FullScreenLoader() {
  return (
    <div className="flex justify-center items-center size-full">
      <Spinner className="text-primary size-6" />
    </div>
  );
}

"use client"

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { createContext, use } from "react";
import { ChevronUpIcon } from "lucide-react";


type FormStepperContextType = {
  maxStep: number
  currentStep: number
}

const FormStepperContext = createContext<FormStepperContextType | undefined>(undefined)

function useFormStepper() {
  const ctx = use(FormStepperContext)
  if (!ctx) throw new Error("useFormStepper must be used within Stepper")
  return ctx
}

function FormStepper({
  maxStep, currentStep,
  // ---
  className, children, ...props
}: React.ComponentProps<"div"> & FormStepperContextType) {
  return (
    <FormStepperContext.Provider value={{ maxStep, currentStep }}>
      <div
        data-slot="stepper"
        className={cn(
          "relative flex justify-between items-center",
        )}
        aria-description={`Schritt ${currentStep} / ${maxStep}`}
        {...props}
      >
        <FormStepProgress />
        {children}
      </div>
    </FormStepperContext.Provider>
  );
}

function FormStepProgress({
  className,
  ...props
}: React.ComponentProps<"div"> & {}) {
  const { maxStep, currentStep } = useFormStepper()

  // derived state
  const stepWidth = (100 / (maxStep - 1))
  const stepProgress = stepWidth * currentStep - stepWidth

  return (
    <div
      data-slot="stepper-progress"
      className="absolute inset-0 flex items-center px-5"
      role="presentation"
      {...props}
    >
      <Progress className="bg-secondary h-1.5" value={stepProgress} />
    </div>
  );
}


function FormStep({
  step,
  disabled,
  className,
  ...props
}: React.ComponentProps<typeof Button> & {
  step: number
}) {
  const { maxStep, currentStep } = useFormStepper()

  if (step < 1 || step > maxStep) throw new Error(`step digit is not allowed to be outside of step range (1 - ${maxStep})`)

  // derived state
  const isCurrentStep = step === currentStep
  const active = step <= currentStep
  const reachable = step <= currentStep + 1
  const isDisabled = !reachable || disabled

  return (
    <Button
      data-slot="stepper-step"
      type="button"
      className={cn(
        "relative z-10 bg-transparent border-0 rounded-full transition-opacity duration-150",
        "opacity-100!", // always full opacity
        className
      )}
      size="icon"
      aria-description={`Gehe zu Schritt ${step} / ${maxStep}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      <div className={cn(
        "-z-10 absolute inset-0 bg-secondary rounded-full transition-colors",
        active && "bg-primary", // fill circle if active
      )}></div>
      <ChevronUpIcon className={cn(
        "left-1/2 -z-20 absolute text-secondary-foreground -translate-x-1/2",
        "transition-all transition-discrete", // enable enter/exit animation
        "top-1/2 opacity-0", // initial
        isCurrentStep && "top-full opacity-100", // animate 
        !isCurrentStep && "top-1/2 opacity-0" // exit
      )} />
      <span
        className={cn(
          "z-10 text-secondary-foreground text-xl",
          active && "text-primary-foreground",
          isDisabled && "text-muted-foreground" // show disabled state with muted text
        )}
        role="presentation"
      >{step}</span>
    </Button>
  );
}

export {
  FormStepper,
  FormStepProgress,
  FormStep
};


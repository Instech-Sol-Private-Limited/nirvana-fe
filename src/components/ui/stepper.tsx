import { cn } from "@/lib/utils";
import React from "react";

interface Step {
  id: number;
  title: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full pt-10 pb-16">
      <div className="w-full flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="w-full flex items-center justify-center gap-5">
              <div className="w-fit flex flex-col gap-4 items-center relative">
                <div
                  className={cn(
                    "md:w-[58px] md:h-[58px] w-10 h-10 md:text-[28px] text-xl flex items-center justify-center rounded-full font-bold",
                    currentStep >= step.id
                      ? "bg-primary text-white"
                      : "bg-[#00732E]/20 text-primary"
                  )}
                >
                  {step.id}
                </div>

                <p
                  className={cn(
                    `md:text-xl sm:text-base text-sm font-medium font-roboto text-center absolute tracking-[-0.4px] w-[140px] top-full pt-3`,
                    currentStep === step.id ? "text-textdark" : "text-textlight"
                  )}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {index + 1 < steps.length ? (
              <div
                className={`flex-grow w-full h-0.5 ${
                  currentStep > step.id ? "bg-green-700" : "bg-gray-300"
                }`}
              />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  const steps = [
    { number: 1, label: "Seleção" },
    { number: 2, label: "Atributos" },
    { number: 3, label: "Geração" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-6 print:hidden">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              currentStep === step.number
                ? "bg-primary text-primary-foreground scale-105"
                : currentStep > step.number
                ? "bg-muted text-muted-foreground"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            <span className="font-bold">{step.number}</span>
            <span className="text-sm hidden sm:inline">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-8 h-0.5 bg-muted mx-1" />
          )}
        </div>
      ))}
    </div>
  );
};

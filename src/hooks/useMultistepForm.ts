import { ReactElement, useState } from "react";

export default function useMultistepForm(steps: ReactElement[]) {

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const [data, setData] = useState({});

    const next = () => setCurrentStepIndex(() => {
        if (currentStepIndex < steps.length - 1) return currentStepIndex + 1
        else return currentStepIndex;
    })

    const prev = () => setCurrentStepIndex(() => {
        if (currentStepIndex > 0) return currentStepIndex - 1
        else return currentStepIndex;
    })

    const reset = () => {
        setCurrentStepIndex(0);
        setData({});
    }

    return {
        data,
        step: steps[currentStepIndex],
        currentStepIndex,
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        next,
        prev,
        reset
    }
}
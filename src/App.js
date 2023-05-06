import { useState } from "react";

const myFlow = [
  {
    id: 1,
    handler: () => "DATA 1"
  },
  {
    id: 2,
    handler: () => "DATA 2"
  },
  {
    id: 3,
    handler: () =>
      fetch(`https://swapi.dev/api/people/1`).then((res) => res.json())
  }
];

const useFlow = (flow = []) => {
  const [stepsData, setStepsData] = useState([]);
  const [step, setStep] = useState(null);

  const run = async () => {
    setStepsData([]);
    for (let i = 0; i < flow.length; i++) {
      const currentStep = flow[i];

      const currentHandler = currentStep.handler();

      if (typeof currentHandler?.then === "function") {
        setStepsData((prev) => [
          ...prev,
          {
            id: currentStep.id,
            status: "loading",
            isAsync: true,
            data: undefined
          }
        ]);

        const data = await currentStep.handler();
        setStep(data);

        setStepsData((prev) => [
          ...prev.filter((item) => item.id !== currentStep.id),
          {
            id: currentStep.id,
            status: "idle",
            isAsync: true,
            data
          }
        ]);
      } else {
        const data = currentStep?.handler();
        setStep(data);
        setStepsData((prev) => [...prev, data]);
      }
    }
  };

  return {
    step,
    run,
    stepsData
  };
};

export default function App() {
  const { step, run, stepsData } = useFlow(myFlow);

  return (
    <div className="App">
      <button onClick={run}>Run flow</button>
      {stepsData.map((item, i) => {
        if (item?.isAsync && item?.status === "loading") {
          return <h1 key={i}>Loading...</h1>;
        }

        return <h1 key={i}>{JSON.stringify(item)}</h1>;
      })}
    </div>
  );
}

import * as React from "react";
import { useTrackRender } from "../helpers";
import { TestCase } from "../types";

export default {
  title: "Basic change of context",
  Root,
} as TestCase;

function Root() {
  useTrackRender();

  return (
    <MyContextProvider>
      <Child />
    </MyContextProvider>
  );
}

const MyContext = React.createContext("Fail: waiting for context change");

function Child() {
  const { useContext } = useTrackRender();
  const context = useContext(MyContext);

  return <>{context}</>;
}

function MyContextProvider({ children }: { children?: React.ReactNode }) {
  const { useState } = useTrackRender();
  const [value, setValue] = useState(0);

  React.useEffect(() => {
    const t = setTimeout(() => {
      if (value < 2) {
        setValue(value + 1);
      }
    }, 10);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <MyContext.Provider
      value={value === 2 ? "OK" : "Fail: waiting for context change"}
    >
      {children}
    </MyContext.Provider>
  );
}

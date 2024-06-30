import React, { createContext, useState } from "react";

const FridgeContext = createContext();

export const FridgeProvider = ({ children }) => {
  const [fridgeId, setFridgeId] = useState(null);

  return (
    <FridgeContext.Provider value={{ fridgeId, setFridgeId }}>
      {children}
    </FridgeContext.Provider>
  );
};

export default FridgeContext;

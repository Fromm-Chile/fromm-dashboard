import { useState } from "react";

type ModalStates = {
  [key: string]: boolean;
};

type UseModalStatesReturn = [
  ModalStates,
  (key: string, isOpen: boolean) => void
];

export const useModalStates = (
  initialObject: ModalStates,
  onStateChange?: (key: string, isOpen: boolean) => void
): UseModalStatesReturn => {
  const [initialState, setInitialState] = useState<ModalStates>(initialObject);

  const handleState = (key: string, isOpen: boolean) => {
    setInitialState((prevState) => ({
      ...prevState,
      [key]: isOpen,
    }));
    if (onStateChange) {
      onStateChange(key, isOpen);
    }
  };
  return [initialState, handleState];
};

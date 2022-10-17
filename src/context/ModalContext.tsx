// React

import { createContext, useState, useEffect } from "react";

interface ModalContextValue {
  isPresenting: boolean;
  modalComponent?: React.ReactElement;
  presentComponentAsModal: (component: React.ReactElement) => void;
  dismissModal: () => void;
}

export const ModalContext: React.Context<ModalContextValue> =
  createContext<ModalContextValue>({
    isPresenting: false,
    presentComponentAsModal: () => {},
    dismissModal: () => {},
  });

interface ModalProviderProps {
  children: JSX.Element;
}

const ModalProvider = ({ children }: ModalProviderProps): JSX.Element => {
  const [isPresenting, setIsPresenting] = useState<boolean>(false);
  const [modalComponent, setModalComponent] = useState<JSX.Element>();

  const presentComponentAsModal = (component: React.ReactElement): void => {
    setTimeout(() => {
      setModalComponent(component);
    }, 100);
  };

  const dismissModal = (): void => {
    setModalComponent(undefined);
  };

  const value: ModalContextValue = {
    isPresenting,
    modalComponent,
    presentComponentAsModal,
    dismissModal,
  };

  useEffect(() => {
    setIsPresenting(!!modalComponent);
  }, [modalComponent]);

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export default ModalProvider;

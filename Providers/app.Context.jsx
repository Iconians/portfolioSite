import React, { createContext, useContext, useState } from "react";
import { portfolioItems } from "../src/PorfolioItems";

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  const modalOpen = ({ target: { id } }) => {
    const selectedItem = portfolioItems.filter(
      (item) => item.id === parseInt(id)
    );
    setModalData(selectedItem);
    setOpenModal(true);
  };

  const modalClose = () => {
    setOpenModal(false);
  };
  return (
    <AppContext.Provider
      value={{
        openModal,
        modalData,
        modalOpen,
        modalClose,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return {
    openModal: context.openModal,
    modalData: context.modalData,
    modalOpen: context.modalOpen,
    modalClose: context.modalClose,
  };
};

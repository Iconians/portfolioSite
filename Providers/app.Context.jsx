import React, { createContext, useContext, useState } from "react";
import { portfolioItems } from "../src/PorfolioItems";

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openAbout, setAbout] = useState(false);
  const [openContact, setContact] = useState(false);

  const modalOpen = ({ target: { name, id } }) => {
    console.log(name);
    if (name === undefined) {
      const selectedItem = portfolioItems.filter(
        (item) => item.id === parseInt(id)
      );
      setModalData(selectedItem);
      setOpenModal(true);
    }

    if (name === "schedule") {
      setOpenSchedule(true);
    }
    if (name === "about") {
      setAbout(true);
    }
    if (name === "contact") {
      setContact(true);
    }
  };

  const modalClose = ({ target: { name } }) => {
    console.log(name);
    if (name === "portfolioItems") {
      setOpenModal(false);
    }
    if (name === "schedule") {
      setOpenSchedule(false);
    }
    if (name === "about") {
      setAbout(false);
    }
    if (name === "contact") {
      setContact(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        openModal,
        modalData,
        modalOpen,
        modalClose,
        openSchedule,
        openAbout,
        openContact,
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
    openSchedule: context.openSchedule,
    openAbout: context.openAbout,
    openContact: context.openContact,
  };
};

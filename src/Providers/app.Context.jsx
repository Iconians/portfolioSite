import React, { createContext, useContext, useEffect, useState } from "react";
import { portfolioItems } from "../PorfolioItems";

const AppContext = createContext({});

export const AppProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openAbout, setAbout] = useState(false);
  const [openContact, setContact] = useState(false);

  const modalOpen = ({ target: { name, id } }) => {
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

  const modalClose = () => {
    setOpenModal(false);
    setOpenSchedule(false);
    setAbout(false);
    setContact(false);
  };

  useEffect(() => {
    openModal
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [openModal]);

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

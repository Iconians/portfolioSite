import React, { createContext, useContext, useEffect, useState } from "react";
import { portfolioItems } from "../PorfolioItems";

type AppContextProps = {
  children?: JSX.Element | JSX.Element[];
};

type portfolioItem = {
  img: string;
  caption: string;
  desc: string;
  category: string;
  url: string;
  key: number;
  id: number;
};

type modalOpen = (event: React.MouseEvent<HTMLDivElement>) => void;

type AppContext = {
  openModal: boolean;
  modalData: portfolioItem[] | [];
  modalOpen: modalOpen;
  modalClose: () => void;
  openSchedule: boolean;
  openAbout: boolean;
  openContact: boolean;
};

const AppContext = createContext({} as AppContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<portfolioItem[]>([]);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openAbout, setAbout] = useState(false);
  const [openContact, setContact] = useState(false);

  const modalOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const name = target.getAttribute("name");
    const id = target.getAttribute("id");
    console.log(name, id);
    if (name === null) {
      const selectedItem = portfolioItems.filter(
        (item) => item.id === parseInt(id || "")
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

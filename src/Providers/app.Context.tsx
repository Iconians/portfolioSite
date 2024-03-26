import React, { createContext, useContext, useEffect, useState } from "react";
import { portfolioItems } from "../utils/PorfolioItems";

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
  openFullPageModal: (name: string) => void;
};

const AppContext = createContext({} as AppContext);

export const AppProvider = ({ children }: AppContextProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<portfolioItem[]>([]);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [openAbout, setAbout] = useState(false);
  const [openContact, setContact] = useState(false);

  const modalOpen = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget as HTMLElement;
    const id = target.getAttribute("id");

    // if (name === null) {
    const selectedItem = portfolioItems.filter(
      (item) => item.id === parseInt(id || "")
    );
    setModalData(selectedItem);
    setOpenModal(true);
    // }
  };

  const openFullPageModal = (name: string) => {
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
        openFullPageModal,
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
    openFullPageModal: context.openFullPageModal,
  };
};

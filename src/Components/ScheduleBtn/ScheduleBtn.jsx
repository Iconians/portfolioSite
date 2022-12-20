import React from "react";
import { useAppContext } from "../../../Providers/app.Context";

export const ScheduleComponent = () => {
  const { openScheduleBtn } = useAppContext();

  return (
    <div>
      <button onClick={openScheduleBtn}>Schedule </button>
    </div>
  );
};

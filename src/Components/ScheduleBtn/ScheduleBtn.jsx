import React from "react";
import { useAppContext } from "../../../Providers/app.Context";

export const ScheduleComponent = () => {
  const { modalOpen } = useAppContext();

  return (
    <div>
      <button name="schedule" onClick={modalOpen}>
        Schedule{" "}
      </button>
    </div>
  );
};

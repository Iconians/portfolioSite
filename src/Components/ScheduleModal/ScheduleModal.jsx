import React from "react";
import { useAppContext } from "../../../Providers/app.Context";
import "./ScheduleModal.css";

export const ScheduleModal = () => {
  const { modalClose, openSchedule } = useAppContext();

  return (
    <div className={`schedule-wrapper ${openSchedule ? "is-visible" : null}`}>
      <div className="schedule-dialog ">
        <div className="title-wrapper">
          <h2>Schedule A Time to Talk</h2>
        </div>
        <div className="iframe-wrapper">
          <iframe
            src="https://app.squarespacescheduling.com/schedule.php?owner=25150356"
            title="Schedule Appointment"
            width="100%"
            height="500"
            frameBorder="0"
          ></iframe>
          <script
            src="https://embed.acuityscheduling.com/js/embed.js"
            type="text/javascript"
          ></script>
        </div>
        <div className="btn-wrapper">
          <button name="schedule" onClick={modalClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

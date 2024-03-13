import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useAppContext } from "../../Providers/app.Context";
import "./ScheduleModal.css";
import Nav from "../Nav/Nav";

export const ScheduleModal = () => {
  const { modalClose, openSchedule } = useAppContext();

  return (
    // ${openSchedule ? "is-visible" : null}
    <div className={`schedule-wrapper `}>
      <Nav />
      <div className="schedule-dialog ">
        <div className="title-wrapper">
          <h2>Schedule A Time to Talk</h2>
          {/* <FontAwesomeIcon
            icon={faTimes}
            name="schedule"
            onClick={modalClose}
            className="fa-times schedule-fa-times"
          /> */}
        </div>
        <div className="iframe-wrapper">
          <iframe
            src="https://app.squarespacescheduling.com/schedule.php?owner=25150356&appointmentType=29960941"
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
        {/* <div className="btn-wrapper">
          <button name="schedule" >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
};

import { useAppContext } from "../../Providers/app.Context";
import "./ContactModal.css";

export const ContactModal = () => {
  const { openContact, modalClose } = useAppContext();
  return (
    <div
      className={`contact-modal-wrapper ${openContact ? "is-visible" : null}`}
    >
      <div className="contant-dialog">
        <div className="title">Contact</div>
        <div className="name-wrapper">
          <h2>Clayton Cripe</h2>
        </div>
        <div className="desc-wrapper">
          <p>
            {" "}
            Have a project or question? <br /> send me a message
          </p>
          <p>I will reply within 48 Hours.</p>
        </div>
        <div>
          <form
            className="form-grid"
            action="https://formsubmit.co/claytonCripe@gmail.com"
            method="POST"
          >
            <input
              className="input"
              type="text"
              name="name"
              placeholder="Name"
              required
            />
            <input
              className="input"
              type="text"
              name="email"
              placeholder="Email"
              required
            />
            <input
              className="input"
              type="text"
              name="projectName"
              placeholder="Project Title"
              required
            />
            <input
              className="input"
              type="text"
              name="projectDesc"
              placeholder="Project Details"
              required
            />
            <input className="input-submit" type="submit" value="submit" />
          </form>
        </div>
        <div className="schedule-link">
          want to Schedule a Consultation?{" "}
          <a href="https://ScheduleacallwithClaytonCripe.as.me/Upwork">
            Schedule Here
          </a>
        </div>
        <div>
          <button name="contact" onClick={modalClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

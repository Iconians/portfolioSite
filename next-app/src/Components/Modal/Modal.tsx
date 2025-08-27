import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../../Providers/app.Context";
import "./Modal.css";

const Modal = () => {
  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && modalClose) {
      modalClose();
    }
  };

  const { modalData, modalClose, openModal } = useAppContext();
  return (
    <div
      className={`modal-wrapper ${!openModal ? null : "is-visible"}`}
      onClick={handleWrapperClick}
    >
      {modalData.map((item) => (
        <div data-animation="slideInOutTop" key={item.id}>
          <div className={`${!openModal ? null : "is-visible"} modal-dialog`}>
            <div className="btn-div">
              <FontAwesomeIcon
                icon={faTimes}
                onClick={modalClose}
                className="fa-times"
              />
            </div>
            <div className="project-name">
              <h2>{item.caption}</h2>
              <h4>{item.category}</h4>
            </div>
            <div className="img-div">
              <img src={item.img} alt="project Picture" />
            </div>
            <div className="desc-wrapper">
              <p>{item.desc}</p>
              <a href={item.url}>Click here to view Site</a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Modal;

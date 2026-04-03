import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import styles from "./index.module.css";

const SubscriptionModal = ({ show, handleClose }) => {
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Đăng ký nhận thông báo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles["social-area"]}>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <img
              src="/images/facebook-sub.png"
              alt="facebook-sub"
              width="100%"
            />
            <a
              href="https://www.facebook.com/KhoaVienThong1.PTIT"
              target="_blank"
              style={{ textDecoration: "none", color: "#1877f2" }}
            >
              https://www.facebook.com/KhoaVienThong1.PTIT
            </a>
          </div>

          <div className="d-flex flex-column justify-content-center align-items-center">
            <img src="/images/youtube-sub.png" alt="youtube-sub" width="100%" />
            <a
              href="https://www.youtube.com/@KhoaVienthong1"
              target="_blank"
              style={{ textDecoration: "none", color: "#c4302b" }}
            >
              https://www.youtube.com/@KhoaVienthong1
            </a>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SubscriptionModal;

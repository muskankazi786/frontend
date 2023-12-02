import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

import styles from "../../styles/BusinessHoursModal.module.css";

import { BusinessDay, BusinessHours } from "@/Models/ListData";
import { BusinessHoursObject } from "@/Models/BusinessHoursObject";
import { changeTimeToTwelveHourFormat } from "@/utils/changeTimeToTwelveHourFormat";

const BusinessHoursModal: React.FC<{
  title: string;
  item: BusinessHoursObject;
  show: boolean;
  onHide: () => void;
}> = (props) => {
  const { title, item } = props;

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName={styles["modal-custom-width"]}
      size="lg"
      centered
    >
      <Modal.Header
        closeButton
        style={{ borderBottom: 0, padding: "32px 24px 8px 24px" }}
      >
        <Modal.Title
          id="contained-modal-title-vcenter"
          className={styles["modal-title-cstm"]}
        >
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles["show-grid"]}>
        {item &&
          Object.keys(item).map((key) => (
            <Row key={key} className={styles["row-container"]}>
              <Col xs={3} className={styles.day}>
                {key}
              </Col>
              <Col className={styles.hours}>
                {item[key][2] && item[key][2].closed
                  ? `: ${item[key][2].closed}`
                  : item[key][2] && item[key][2].open
                  ? `: ${item[key][2].open}`
                  : item[key].length === 2 &&
                    item[key][0].open &&
                    item[key][0].close &&
                    item[key][1].open &&
                    item[key][1].close
                  ? `: ${changeTimeToTwelveHourFormat(
                      (item[key][0] as BusinessDay).open
                    )} - ${changeTimeToTwelveHourFormat(
                      (item[key][0] as BusinessDay).close
                    )} \u00A0\u00A0\u00A0\u00A0${changeTimeToTwelveHourFormat(
                      (item[key][1] as BusinessDay).open
                    )} - ${changeTimeToTwelveHourFormat(
                      (item[key][1] as BusinessDay).close
                    )}`
                  : item[key].length === 2 &&
                    item[key][0].open &&
                    item[key][0].close &&
                    !item[key][1].open &&
                    !item[key][1].close
                  ? `: ${changeTimeToTwelveHourFormat(
                      (item[key][0] as BusinessDay).open
                    )} - ${changeTimeToTwelveHourFormat(
                      (item[key][0] as BusinessDay).close
                    )}`
                  : ""}
              </Col>
            </Row>
          ))}
      </Modal.Body>
    </Modal>
  );
};

export default BusinessHoursModal;

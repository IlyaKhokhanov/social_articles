import { Button } from '../button/button';
import { IActionButtons } from './actionButtons.props';

import styles from './actionButtons.module.css';

export const ActionButtons = ({ editBtn, deleteBtn }: IActionButtons) => {
  return (
    <div className={styles.wrapper}>
      {editBtn && (
        <Button className={styles.btn} onClick={editBtn.cb}>
          {editBtn.text}
        </Button>
      )}
      {deleteBtn && (
        <Button className={styles.btnDelete} onClick={deleteBtn.cb}>
          {deleteBtn.text}
        </Button>
      )}
    </div>
  );
};

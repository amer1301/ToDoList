import styles from "./ConfirmDialog.module.css";

type Props = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  title = "Bekräfta",
  message,
  confirmText = "Ta bort",
  cancelText = "Avbryt",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className={styles.actions}>
          <button onClick={onCancel}>{cancelText}</button>
          <button className={styles.danger} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

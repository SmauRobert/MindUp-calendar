import React, { useState } from "react";
import styles from "./EditIntervalModal.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
	isOpen: boolean;
	label: string;
	onSave: (newLabel: string) => void;
	onClose: () => void;
}

const EditIntervalModal: React.FC<Props> = ({
	isOpen,
	label,
	onSave,
	onClose,
}) => {
	const { t } = useTranslation();
	const [value, setValue] = useState(label);

	// Reset value when label changes
	React.useEffect(() => {
		setValue(label);
	}, [label, isOpen]);

	if (!isOpen) return null;

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<h3>{t("calendar.editLabel")}</h3>
				<input
					className={styles.input}
					type="text"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					maxLength={32}
					autoFocus
				/>
				<div className={styles.actions}>
					<button onClick={() => onSave(value)}>
						{t("calendar.save")}
					</button>
					<button onClick={onClose} className={styles.cancel}>
						{t("calendar.cancel")}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditIntervalModal;

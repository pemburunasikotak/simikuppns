import ReactDOM from "react-dom/client";
import ConfirmDialog, { ConfirmProps } from "./confirm-dialog";

export function confirm({
  title,
  description,
  okText,
  cancelText,
  icon,
  onOk,
}: ConfirmProps): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    const handleClose = () => {
      root.unmount();
      container.remove();
      resolve(true);
    };

    const handleOk = () => {
      handleClose();
      onOk?.();
    };

    root.render(
      <ConfirmDialog
        icon={icon}
        title={title}
        description={description}
        okText={okText}
        cancelText={cancelText}
        onClose={handleClose}
        onOk={handleOk}
      />,
    );
  });
}

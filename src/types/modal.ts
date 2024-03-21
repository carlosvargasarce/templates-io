import { MyDocumentProps } from './document';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: MyDocumentProps | null;
}

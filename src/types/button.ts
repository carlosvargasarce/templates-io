export type bgColor = 'primaryColor' | 'grayColor' | 'danger' | 'whiteColor';
export type buttonType = 'button' | 'submit' | 'reset';

export interface ButtonProps {
  label: string;
  bgColor?: bgColor;
  style?: React.CSSProperties;
  isLoading?: boolean;
  onClick?: () => void;
  type?: buttonType;
  disabled?: boolean;
}

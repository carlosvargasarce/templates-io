type bgColor = 'primaryColor' | 'grayColor' | 'danger' | 'whiteColor';
type buttonType = 'button' | 'submit' | 'reset';

export type ButtonProps = {
  label: string;
  bgColor?: bgColor;
  style?: React.CSSProperties;
  isLoading?: boolean;
  onClick?: () => void;
  type?: buttonType;
  disabled?: boolean;
};

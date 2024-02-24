export type ButtonProps = {
  label: string;
  bgColor?: 'primaryColor' | 'grayColor' | 'danger';
  style?: React.CSSProperties;
  isLoading?: boolean;
  onClick?: () => void;
};

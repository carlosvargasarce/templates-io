export interface TemplateOption {
  id: string;
  name: string;
}

export interface SelectProps {
  id: string;
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  style?: React.CSSProperties;
  items: TemplateOption[];
  defaultOptionMessage: string;
}

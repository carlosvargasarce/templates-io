export type inputType = 'text' | 'email' | 'password';

export interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: inputType;
  required?: boolean;
  style?: React.CSSProperties;
}

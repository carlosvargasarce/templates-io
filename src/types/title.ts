export type Size = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type Color = 'grayColor' | 'primaryColor' | 'whiteColor';
export type textAlign = 'left' | 'center' | 'right';

export interface TitleProps {
  children: React.ReactNode;
  size?: Size;
  color?: Color;
  textAlign?: textAlign;
  style?: React.CSSProperties;
}

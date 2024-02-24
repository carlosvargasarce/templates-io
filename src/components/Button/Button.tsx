import { colors } from '@/constants/colors';
import { ButtonProps } from '@/types/button';
import React from 'react';

const Button: React.FC<ButtonProps> = ({
  label = 'Botón',
  bgColor = 'primaryColor',
  isLoading = false,
  style,
  onClick,
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors[bgColor] || colors.grayColor,
    color: 'white',
    padding: '0 16px',
    lineHeight: '50px',
    height: '50px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    minWidth: '200px',
    fontWeight: 'bold',
    opacity: isLoading ? 0.7 : 1,
    pointerEvents: isLoading ? 'none' : 'auto',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      tabIndex={0}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? 'Cargando...' : label}
    </button>
  );
};

export default Button;

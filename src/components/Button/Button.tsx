import { colors } from '@/constants/colors';
import { ButtonProps } from '@/types/button';
import React from 'react';

const Button: React.FC<ButtonProps> = ({
  label = 'Botón',
  bgColor = 'primaryColor',
  type = 'button',
  isLoading = false,
  disabled = false,
  style,
  onClick,
}) => {
  const buttonStyle: React.CSSProperties = {
    backgroundColor: colors[bgColor] || colors.grayColor,
    color: 'white',
    padding: '0 16px',
    lineHeight: '60px',
    height: '60px',
    border: '1px solid',
    borderColor: colors[bgColor] || colors.grayColor,
    borderRadius: '10px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    minWidth: '200px',
    fontWeight: 'bold',
    opacity: isLoading || disabled ? 0.5 : 1,
    pointerEvents: isLoading || disabled ? 'none' : 'auto',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      tabIndex={0}
      disabled={isLoading || disabled}
      onClick={onClick}
      type={type}
    >
      {isLoading ? 'Cargando...' : label}
    </button>
  );
};

export default Button;

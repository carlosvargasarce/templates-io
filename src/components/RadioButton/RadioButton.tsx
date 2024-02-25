import { colors } from '@/constants/colors';
import { RadioButtonProps } from '@/types/radioButton';
import React from 'react';

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  label,
  value,
  checked,
  onChange,
}) => {
  const containerStyle: React.CSSProperties = {
    margin: '24px 0',
  };

  const labelStyle: React.CSSProperties = {
    marginLeft: '8px',
    cursor: 'pointer',
  };

  const inputStyle: React.CSSProperties = {
    accentColor: colors.primaryColor,
    cursor: 'pointer',
    width: '24px',
    height: '24px',
    position: 'relative',
    top: '5px',
  };

  return (
    <div style={containerStyle}>
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={inputStyle}
      />
      <label htmlFor={id} style={labelStyle}>
        {label}
      </label>
    </div>
  );
};

export default RadioButton;

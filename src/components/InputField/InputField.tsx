import { InputFieldProps } from '@/types/inputField';
import React from 'react';

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  name,
  required = false,
  style,
  ...props
}) => {
  const inputStyle: React.CSSProperties = {
    padding: '0 16px',
    lineHeight: '60px',
    border: '1px solid #b1b1b1',
    borderRadius: '10px',
    marginBottom: '24px',
    color: '#525252',
    width: '100%',
    fontSize: '24px',
    ...style,
  };

  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: '8px',
          fontWeight: 'bold',
          fontSize: '24px',
        }}
      >
        {label}:
      </label>
      <input
        type={type}
        id={id}
        value={value}
        name={name}
        onChange={onChange}
        required={required}
        style={inputStyle}
        {...props}
      />
    </div>
  );
};

export default InputField;

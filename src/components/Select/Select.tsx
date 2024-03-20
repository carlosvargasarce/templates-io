import { SelectProps } from '@/types/select';
import Icon from '@icon-park/react/es/all';
import React from 'react';

const Select: React.FC<SelectProps> = ({
  id,
  label,
  value,
  onChange,
  items,
  name,
  required = false,
  style,
  defaultOptionMessage,
  disabled = false,
  ...props
}) => {
  const selectStyle: React.CSSProperties = {
    padding: '0 32px 0 16px',
    height: '60px',
    lineHeight: '60px',
    border: '1px solid #b1b1b1',
    borderRadius: '10px',
    marginBottom: '24px',
    color: '#525252',
    width: '100%',
    fontSize: '24px',
    appearance: 'none',
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
      <select
        id={id}
        value={value}
        name={name}
        onChange={onChange}
        required={required}
        style={selectStyle}
        disabled={disabled}
        {...props}
      >
        <option value="">{defaultOptionMessage}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <Icon
        style={{
          position: 'absolute',
          right: '20px',
          top: '56px',
          fontSize: '24px',
          pointerEvents: 'none',
        }}
        type="Down"
      />
    </div>
  );
};

export default Select;

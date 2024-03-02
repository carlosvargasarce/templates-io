import { SwitchProps } from '@/types/switch';
import React from 'react';
import styles from './Switch.module.scss';

const Switch: React.FC<SwitchProps> = ({ id, name, checked, onChange }) => {
  return (
    <label className={styles.switchContainer}>
      <input
        id={id}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.switchCheckbox}
      />
      <span className={styles.switchSlider}></span>
    </label>
  );
};

export default Switch;

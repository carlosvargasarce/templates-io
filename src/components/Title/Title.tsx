import { colors } from '@/constants/colors';
import { TitleProps } from '@/types/title';
import React from 'react';

const Title: React.FC<TitleProps> = ({
  children,
  size = 'h1',
  color = 'grayColor',
  textAlign = 'left',
}) => {
  const titleStyle: React.CSSProperties = {
    color: colors[color] || colors.grayColor,
    textAlign,
  };

  const TitleElement = size || 'h1';

  return <TitleElement style={titleStyle}>{children}</TitleElement>;
};

export default Title;

import { font } from './baseStyles';
import { colors } from './colors';

export const customStyles = {
  headRow: {
    style: {
      backgroundColor: colors.grayDarkColor,
    },
  },
  header: {
    style: {
      color: colors.whiteColor,
    },
  },
  head: {
    style: {
      minHeight: '60px',
      color: colors.whiteColor,
      fontSize: font.fontSizeDefault,
      fontWeight: font.fontWeightDefault,
    },
  },
  cells: {
    style: {
      borderLeftWidth: '1px',
      borderLeftColor: colors.grayColor,
      borderLeftStyle: 'solid',

      '&:last-child': {
        borderRightWidth: '1px',
        borderRightColor: colors.grayColor,
        borderRightStyle: 'solid',
      },
    },
  },
  rows: {
    style: {
      minHeight: '60px',
      fontSize: font.fontSizeDefault,
      fontWeight: font.fontWeightDefault,
      backgroundColor: colors.grayLightColor,
    },
    selectedHighlightStyle: {
      '&:nth-of-type(n)': {
        backgroundColor: colors.whiteColor,
        borderBottomColor: colors.grayColor,
      },
    },
  },
  pagination: {
    style: {
      minHeight: '60px',
    },
  },
};

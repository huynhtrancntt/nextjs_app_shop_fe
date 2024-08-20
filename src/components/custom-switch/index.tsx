import React from 'react';
import { Switch, SwitchProps } from '@mui/material';
import { styled, Theme } from '@mui/material/styles';

type TCustomSelect = SwitchProps & {
  // Add any custom props here if needed
};

const StyledSwitch = styled(Switch)<SwitchProps>(({ theme }) => ({
  // Your custom styling here
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.customColors.borderColor,
  },
}));

const CustomSwitch = (props: TCustomSelect) => {
  const { ...rest } = props;

  return <StyledSwitch {...rest} />;
};

export default CustomSwitch;

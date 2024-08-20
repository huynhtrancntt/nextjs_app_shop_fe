import React from 'react';
import { Switch, SwitchProps } from '@mui/material';
import { styled } from '@mui/system';

type TCustomSelect = SwitchProps & {
  // Add any custom props here if needed
};

const StyledSwitch = styled(Switch)(({ theme }) => ({
  // Your custom styling here
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.customColors.borderColor
  }

}));

const CustomSwitch = (props: TCustomSelect) => {
  const { ...rest } = props;

  return <StyledSwitch {...rest} />;
};

export default CustomSwitch;

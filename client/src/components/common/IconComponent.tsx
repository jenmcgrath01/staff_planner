import React from 'react';
import { IconType } from 'react-icons';

interface IconWrapperProps {
  icon: IconType;
  [key: string]: any;
}

export const IconWrapper = ({ icon: Icon, ...props }: IconWrapperProps) => {
  return React.createElement(Icon as any, props);
};
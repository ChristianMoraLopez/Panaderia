import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CustomIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  icon: LucideIcon;
}

const Icon: React.FC<CustomIconProps> = ({ icon: IconComponent, ...props }) => {
  return <IconComponent {...props} />;
};

export default Icon;
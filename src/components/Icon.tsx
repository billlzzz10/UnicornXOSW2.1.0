import React from 'react';

/**
 * @interface IconProps
 * @description Props for the Icon component.
 */
interface IconProps extends React.SVGAttributes<SVGElement> {
  name: string;
  className?: string;
}

/**
 * Renders an SVG icon from a sprite sheet.
 * @param {IconProps} props - The props for the component.
 */
const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  return (
    <svg
      className={`inline-block w-5 h-5 fill-current ${className}`}
      {...props}
    >
      <use href={`/assets/icons.svg#${name}`} />
    </svg>
  );
};

export default Icon;

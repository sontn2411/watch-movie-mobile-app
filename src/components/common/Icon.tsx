import React from 'react';
import { Svg, Path, SvgProps as RNSvgProps } from 'react-native-svg';

interface SvgProps extends RNSvgProps {
  className?: string;
}
import { cssInterop } from 'nativewind';

/**
 * Define the list of available icons here.
 * You can easily add more icons by adding their path data to this object.
 */
const ICON_LIST = {
  home: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <Path d="M9 22V12h6v10" />
    </Svg>
  ),
  search: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Circle cx="11" cy="11" r="8" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  ),
  play: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Path d="M5 3l14 9-14 9V3z" />
    </Svg>
  ),
  download: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Polyline points="7 10 12 15 17 10" />
      <Line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  ),
  user: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  ),
  settings: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Circle cx="12" cy="12" r="3" />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </Svg>
  ),
  chevronRight: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Polyline points="9 18 15 12 9 6" />
    </Svg>
  ),
  chevronLeft: (props: SvgProps) => (
    <Svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <Polyline points="15 18 9 12 15 6" />
    </Svg>
  ),
};

// Register Svg with NativeWind to support className
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});


// Helper components for the icons
const Circle = (props: any) => <Path d={`M${props.cx} ${props.cy} m -${props.r}, 0 a ${props.r},${props.r} 0 1,0 ${props.r*2},0 a ${props.r},${props.r} 0 1,0 -${props.r*2},0`} {...props} />;
const Line = (props: any) => <Path d={`M${props.x1} ${props.y1} L${props.x2} ${props.y2}`} {...props} />;
const Polyline = (props: any) => {
  const d = props.points.split(' ').reduce((acc: string, point: string, i: number) => {
    const [x, y] = point.split(',');
    return acc + (i === 0 ? `M${x} ${y}` : ` L${x} ${y}`);
  }, '');
  return <Path d={d} {...props} />;
};

export type IconName = keyof typeof ICON_LIST;

interface IconProps extends RNSvgProps {
  name: IconName;
  className?: string;
  size?: number;
}



const Icon: React.FC<IconProps> = ({ name, className, size = 24, color = "currentColor", ...props }) => {
  const IconComponent = ICON_LIST[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found.`);
    return null;
  }

  // Use className directly on IconComponent which is registered via cssInterop
  return (
    <IconComponent 
      width={size} 
      height={size} 
      color={color} 
      className={className}
      {...props} 
    />
  );
};

export default Icon;

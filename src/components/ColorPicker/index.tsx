import React from 'react';
import dynamic from 'next/dynamic';
import { ColorPickerProps } from './ColorPicker';

const NoSSRColorPicker = dynamic(() => import('./ColorPicker'), {
  ssr: false,
});

const ColorPicker: React.FC<ColorPickerProps> = (props) => (
  <NoSSRColorPicker {...props} />
);

export * from './ColorPicker';
export default ColorPicker;

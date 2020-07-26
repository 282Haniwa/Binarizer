import React, { useState } from 'react';
import { ChromePicker, RGBColor, ColorChangeHandler } from 'react-color';

const defaultColor: RGBColor = {
  r: 0,
  g: 0,
  b: 0,
  a: 1,
};

export type Color = RGBColor;

export type ColorPickerProps = {
  color?: RGBColor;
  onChange?: (color: RGBColor) => void;
  onChangeComplete?: (color: RGBColor) => void;
};

const ColorPicker: React.FC<ColorPickerProps> = (props) => {
  const { color: colorProp, onChange, onChangeComplete, ...other } = props;
  const [color, setColor] = useState<RGBColor>(colorProp || defaultColor);

  const handleChange: ColorChangeHandler = (resultColor) => {
    setColor(resultColor.rgb);
    onChange && onChange(resultColor.rgb);
  };

  const handleChangeComplete: ColorChangeHandler = (resultColor) => {
    setColor(resultColor.rgb);
    onChangeComplete && onChangeComplete(resultColor.rgb);
  };

  return (
    <ChromePicker
      color={color}
      onChange={handleChange}
      onChangeComplete={handleChangeComplete}
      {...other}
    />
  );
};

export default ColorPicker;

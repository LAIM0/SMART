import React, { useState } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { Box } from '@chakra-ui/react';

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  initialColor: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  onColorChange,
  initialColor,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false);
  const [color, setColor] = useState<string>(initialColor);

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (newColor: ColorResult) => {
    setColor(newColor.hex);
    onColorChange(newColor.hex);
  };

  return (
    <Box position="relative">
      <Box
        onClick={handleClick}
        p="5px"
        bg="white"
        borderRadius="1px"
        boxShadow="0 0 0 1px rgba(0,0,0,.1)"
        display="inline-block"
        cursor="pointer"
      >
        <Box w="36px" h="14px" borderRadius="2px" bg={color} />
      </Box>
      {displayColorPicker && (
        <Box
          onClick={handleClose}
          position="absolute"
          zIndex="2"
          top="0"
          left="0"
          bottom="0"
          right="0"
        >
          <SketchPicker color={color} onChange={handleChange} />
        </Box>
      )}
    </Box>
  );
};

export default ColorPicker;

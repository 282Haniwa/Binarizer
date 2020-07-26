export interface Mat {
  data: Uint8Array;
  channels: () => number;
  rows: number;
  cols: number;
}

export interface Position {
  row: number;
  column: number;
}

export const forEachPixel = (
  mat: Mat,
  callback: (
    pixel: Uint8Array,
    position: Position,
    index: number,
    channel: number,
    pixelAmount: number,
  ) => void,
): void => {
  const data: Uint8Array = mat.data;
  const channel = mat.channels();
  const pixelAmount = data.length / channel;

  for (
    let index = 0, pixelIndex = 0;
    index < data.length;
    index += channel, pixelIndex++
  ) {
    const pixel = data.subarray(index, index + channel);
    const position: Position = {
      row: Math.floor(pixelIndex / mat.rows),
      column: pixelIndex % mat.rows,
    };
    callback(pixel, position, pixelIndex, channel, pixelAmount);
  }
};

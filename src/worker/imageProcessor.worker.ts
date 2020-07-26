import cv from 'lib/opencv';
import * as util from 'src/commons/utils/opencvUtil';

const context: Worker = self as any;

type BinarizeData = {
  type: string;
  imageData: string;
  color: number[];
  backgroundColor: number[];
  threshold: number;
};

const binarize = async (data: BinarizeData) => {
  cv.then((cv: any) => {
    const src = cv.matFromImageData(data.imageData);
    const grayRgba = src.clone();
    const gray = new cv.Mat(src.rows, src.cols, cv.CV_8U);
    const binary = new cv.Mat(src.rows, src.cols, cv.CV_8UC4);
    const result = new cv.Mat(src.rows, src.cols, cv.CV_8UC4);

    // RGBAのグレースケール画像生成
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    util.forEachPixel(grayRgba, (pixel, position, index, channel) => {
      const start = index * channel;
      const grayData = gray.data[index];
      grayRgba.data.set([grayData, grayData, grayData, pixel[3]], start);
    });

    // 二値化
    cv.threshold(grayRgba, binary, data.threshold, 255, cv.THRESH_BINARY);

    // 色の変更
    util.forEachPixel(binary, (pixel, position, index, channel) => {
      const start = index * channel;
      // const isBlack = pixel[3] === 255;
      const isBlack = pixel[0] + pixel[1] + pixel[2] === 0 && pixel[3] === 255;
      if (isBlack) {
        result.data.set(data.color, start);
      } else {
        result.data.set(data.backgroundColor, start);
      }
    });

    // データ送信
    const resultData = new ImageData(
      new Uint8ClampedArray(result.data),
      result.cols,
      result.rows,
    );
    context.postMessage({
      type: 'processed',
      input: data.imageData,
      output: resultData,
    });

    // メモリ解放
    src.delete();
    grayRgba.delete();
    gray.delete();
    binary.delete();
    result.delete();
  }).catch((error: any) => {
    console.error('opencv error', error);
  });
};

context.addEventListener('message', (event) => {
  const { data } = event;
  switch (data.type) {
    case 'binarize':
      binarize(data);
      break;
    default:
      break;
  }
});

export default context;

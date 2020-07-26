import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Slider, Input } from '@material-ui/core';
import ImageProcessorWorker from 'worker-loader?name=static/[hash].worker.js!src/worker/imageProcessor.worker';
import ColorPicker, { Color } from 'src/components/ColorPicker';

import theme from 'src/commons/theme';
const useStyles = makeStyles((theme: Theme) => ({
  inputFileHide: {
    display: 'none',
  },
  colorPickerWrapper: {
    margin: theme.spacing(4),
  },
  thresholdWrapper: {
    width: '50%',
    margin: theme.spacing(4),
  },
  buttonWrapper: {
    margin: theme.spacing(4),
    '& > *': {
      marginRight: theme.spacing(2),
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  canvasPair: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing(4),
    '& > *': {
      marginRight: theme.spacing(4),
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
  canvasWrapper: {
    padding: theme.spacing(2),
    border: `2px solid ${theme.palette.divider}`,
    fontSize: 0,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [worker, setWorker] = useState<ImageProcessorWorker>();
  const [imageData, setImageData] = useState<ImageData>();
  const [color, setColor] = useState<Color>();
  const [backgroundColor, setBackgroundColor] = useState<Color>();
  const [threshold, setThreshold] = useState<number>(127);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const srcCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement>(null);

  const drawImage = (
    uploadImgSrc: string | ImageData,
    canvas: HTMLCanvasElement | null,
    callback?: (imageData: ImageData | undefined) => void,
  ) => {
    const context = canvas?.getContext('2d');

    if (typeof uploadImgSrc === 'string') {
      const image = new Image();
      image.src = uploadImgSrc;
      image.addEventListener(
        'load',
        () => {
          canvas?.setAttribute('width', image.naturalWidth.toString());
          canvas?.setAttribute('height', image.naturalHeight.toString());
          context?.clearRect(0, 0, image.naturalWidth, image.naturalHeight);
          context?.drawImage(image, 0, 0);
          const imageData = context?.getImageData(
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
          );
          callback && callback(imageData);
        },
        { once: true },
      );
    } else {
      canvas?.setAttribute('width', uploadImgSrc.width.toString());
      canvas?.setAttribute('height', uploadImgSrc.height.toString());
      context?.clearRect(0, 0, uploadImgSrc.width, uploadImgSrc.height);
      context?.putImageData(uploadImgSrc, 0, 0);
      callback && callback(uploadImgSrc);
    }
  };

  const drawSrcImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        window.alert('画像を選択してください');
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        const uploadImgSrc = reader.result as string;
        drawImage(uploadImgSrc, srcCanvasRef.current, (imageData) => {
          setImageData(imageData);
        });
      };
      // ファイル読み込みを実行
      reader.readAsDataURL(file);
    }
  };

  const renderBinarizedImage = () => {
    worker?.postMessage({
      type: 'binarize',
      imageData: imageData,
      color: color
        ? [color.r, color.g, color.b, color.a && color.a * 255]
        : [0, 0, 0, 255],
      backgroundColor: backgroundColor
        ? [
            backgroundColor.r,
            backgroundColor.g,
            backgroundColor.b,
            backgroundColor.a && backgroundColor.a * 255,
          ]
        : [0, 0, 0, 0],
      threshold: threshold,
    });
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = resultCanvasRef.current?.toDataURL('image/png') as string;
    link.download = 'export.png';
    link.click();
  };

  useEffect(() => {
    const imageProcessorWorker = new ImageProcessorWorker();
    imageProcessorWorker.addEventListener('message', (event) => {
      const { data } = event;
      switch (data.type) {
        case 'processed':
          drawImage(data.output, resultCanvasRef.current);
          break;
        default:
          break;
      }
    });
    setWorker(imageProcessorWorker);
    drawImage('/assets/img/lena.png', srcCanvasRef.current, (imageData) => {
      setImageData(imageData);
    });
    return () => imageProcessorWorker.terminate();
  }, []);

  useEffect(() => {
    renderBinarizedImage();
  }, [imageData, color, backgroundColor, threshold]);

  return (
    <>
      <Head>
        <title>Hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className={classes.colorPickerWrapper}>
            <span>色</span>
            <ColorPicker
              color={{ r: 0, g: 0, b: 0, a: 1 }}
              onChangeComplete={(color) => {
                setColor(color);
              }}
            />
          </div>
          <div className={classes.colorPickerWrapper}>
            <span>背景色</span>
            <ColorPicker
              color={{ r: 255, g: 255, b: 255, a: 0 }}
              onChangeComplete={(color) => {
                setBackgroundColor(color);
              }}
            />
          </div>
        </div>
        <div className={classes.thresholdWrapper}>
          <span>閾値</span>
          <Slider
            max={255}
            value={threshold}
            onChangeCommitted={(event, value) => setThreshold(value as number)}
            aria-labelledby="input-slider"
          />
          <Input
            value={threshold}
            margin="dense"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setThreshold(Number(event.target.value))
            }
            inputProps={{
              step: 1,
              min: 0,
              max: 255,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </div>
        <div className={classes.buttonWrapper}>
          <Button component="label" variant="contained">
            ファイルを選択
            <input
              ref={fileInputRef}
              type="file"
              className={classes.inputFileHide}
              onChange={drawSrcImg}
            />
          </Button>
          <Button variant="contained" color="primary" onClick={downloadImage}>
            ダウンロード
          </Button>
        </div>
        <div className={classes.canvasPair}>
          <div className={classes.canvasWrapper}>
            <canvas ref={srcCanvasRef}></canvas>
          </div>
          <div className={classes.canvasWrapper}>
            <canvas ref={resultCanvasRef}></canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

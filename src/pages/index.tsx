import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Button, Typography } from '@material-ui/core';
import ImageProcessorWorker from 'worker-loader?name=static/[hash].worker.js!src/worker/imageProcessor.worker';
import App from 'src/components/App';

const Home = () => {
  const [worker, setWorker] = useState<ImageProcessorWorker>();
  useEffect(() => {
    setWorker(new ImageProcessorWorker());
    return () => worker?.terminate();
  }, []);

  return (
    <>
      <Head>
        <title>Hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App>
        <Typography>Hello!</Typography>
        <Button onClick={() => worker?.postMessage(3)}>test</Button>
      </App>
    </>
  );
};

export default Home;

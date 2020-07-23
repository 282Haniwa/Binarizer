import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import TestWorker from 'worker-loader?name=static/[hash].worker.js!src/worker/test.worker';

const Home = () => {
  const [worker, setWorker] = useState<TestWorker>();
  useEffect(() => {
    setWorker(new TestWorker());
    return () => worker?.terminate();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello!
      <button onClick={() => worker?.postMessage(3)}>test</button>
    </div>
  );
};

export default Home;

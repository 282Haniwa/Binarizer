import React from 'react';
import Head from 'next/head';
import Button from 'src/components/Button';

const Home = () => {
  return (
    <div className="container">
      <Head>
        <title>Hello</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      Hello!
      <Button />
    </div>
  );
};

export default Home;

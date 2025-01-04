/* eslint-disable */

import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../../../../../public/loadbar.json'

const Loader = ({ size = 200 }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Lottie animationData={animationData} style={{ height: size, width: size }} />
    </div>
  );
};

export default Loader;

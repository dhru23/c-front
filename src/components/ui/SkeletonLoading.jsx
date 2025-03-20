import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonLoading({ height, count }) {
  return (
    <div className="p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <Skeleton
        baseColor="#1f2a33" // Darker base for cyberpunk
        highlightColor="#00c39a" // Neon teal highlight
        style={{ height: `${height}px`, width: "100%" }}
        count={count}
      />
    </div>
  );
}

export default SkeletonLoading;
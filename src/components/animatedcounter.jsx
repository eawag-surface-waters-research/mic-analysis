import React, { useEffect, useState } from "react";

const AnimatedCounter = ({ targetNumber = 100, duration = 2000 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = null;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const progressRatio = Math.min(progress / duration, 1);
      const currentValue = progressRatio * targetNumber;
      setValue(currentValue);

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetNumber, duration]);

  return Math.round(value).toLocaleString();
};

export default AnimatedCounter;

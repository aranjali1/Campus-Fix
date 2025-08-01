import React from 'react';

const Title = ({ title, subtitle }) => {
  return (
    <div className="text-center my-8">
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-990 tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-base md:text-lg text-gray-600 max-w-xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
};

export default Title;

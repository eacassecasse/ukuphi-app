import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-orange-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;


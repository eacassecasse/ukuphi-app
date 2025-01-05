import React from 'react';

const DEFAULT_SIGNIN_BG = "/signin-bg-image.png";
const DEFAULT_SIGNUP_BG = "/signup-bg-image.png";

const AuthLayout = ({ children, title, subtitle, isSignIn }) => {
  return (
    <div className="min-h-screen flex">
      {/* rigt Side - Dark Image Background */}
      {isSignIn ? (
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-black order-first lg:order-last">
          <div className="absolute inset-0">
            <img
              src={DEFAULT_SIGNIN_BG}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_SIGNIN_BG;
              }}
              alt="Background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h2 className="text-5xl font-bold mb-4">Welcome back</h2>
            <p className="text-xl text-gray-300">
              Sign in to continue your journey with Ukuphi
            </p>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-black order-last lg:order-first">
          <div className="absolute inset-0">
            <img
              src={DEFAULT_SIGNUP_BG}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_SIGNUP_BG;
              }}
              alt="Background"
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <h2 className="text-5xl font-bold mb-4">Join us</h2>
            <p className="text-xl text-gray-300">
              Create an account and start discovering amazing events
            </p>
          </div>
        </div>
      )}

      {/* Right Side - White Background with Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">
              Tour <span className="text-purple-600">Ukuphi</span>
            </h1>
            <h2 className="text-3xl font-bold mt-6 mb-2">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

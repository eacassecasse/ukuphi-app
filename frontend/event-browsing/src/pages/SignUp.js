import React from "react";

const SignUp = () => {
  return (
    <section className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Sign Up</h1>
      <form>
        {/* Add form fields for sign-up */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default SignUp;

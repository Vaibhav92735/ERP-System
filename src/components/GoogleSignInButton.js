import { useState } from "react";
import { signInWithGoogle } from "../firebase/config";
import { FcGoogle } from "react-icons/fc"; // Google icon from react-icons library

const GoogleSignInButton = ({ onSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onSuccess(user);
      } else {
        setError("Sign-in failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSignIn}
        className={`flex items-center justify-center px-4 py-2 bg-white border rounded-md shadow-md hover:bg-gray-100 transition duration-200 ease-in-out ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? (
          <span className="loader mr-2"></span> // You can style a spinner or use a library like 'react-spinners'
        ) : (
          <FcGoogle className="mr-2 text-lg" />
        )}
        <span className="text-gray-700 font-semibold">Sign in with Google</span>
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default GoogleSignInButton;

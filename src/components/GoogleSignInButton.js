import { useState } from "react";
import { signInWithGoogle } from "../firebase/config"; 

const GoogleSignInButton = ({ onSuccess }) => {
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      onSuccess(user);
    } else {
      setError("Sign in failed. Please try again.");
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign in with Google</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default GoogleSignInButton;

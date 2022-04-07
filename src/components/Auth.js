import { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { auth, db } from "./firebase";
import {
  AuthErrorCodes,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export const Auth = () => {
  const { user } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleLogin = async () => {
    if (!email && !password) return;

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredentials.user);
      setErrorMessage(null);
      return navigate("/");
    } catch (error) {
      console.log(error);
      if (error.code == AuthErrorCodes.USER_DELETED) {
        setErrorMessage("user-not-found");
      } else if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
        setErrorMessage("wrong-password");
      } else if (error.code == AuthErrorCodes.USER_DISABLED) {
        setErrorMessage("user-disabled");
      }
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  const handleSignup = async () => {
    if (!email && !password) return;

    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredentials.user);
      if (!userCredentials || !userCredentials.user) {
        throw new Error("createUserWithEmailAndPassword error");
      }
      await setDoc(
        doc(db, "users", userCredentials.user.uid),
        JSON.parse(JSON.stringify(userCredentials.user))
      );

      return navigate("/");
      setErrorMessage(null);
    } catch (error) {
      console.log(error);
      if (error.code == AuthErrorCodes.EMAIL_EXISTS) {
        setErrorMessage("email-already-in-use");
      } else if (error.code == AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE) {
        setErrorMessage("credential-already-in-use");
      } else if (error.code == AuthErrorCodes.WEAK_PASSWORD) {
        setErrorMessage("weak-password");
      }
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex justify-center ">
      <div className="flex flex-col w-full max-w-lg space-y-3">
        <h1 className="text-3xl text-center">auth</h1>
        <div className="flex justify-center">
          {!user && (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full items-center justify-center space-y-1"
            >
              <label htmlFor="email">
                email
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  id="email"
                  name="email"
                  value={email}
                  className="rounded-lg border-2 border-black px-4 py-1"
                  placeholder="email"
                />
              </label>
              <label htmlFor="password">
                password
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  className="rounded-lg border-2 border-black px-4 py-1"
                  placeholder="password"
                />
              </label>

              {errorMessage && (
                <div className="w-full text-center text-pink-600 bg-pink-100 px-6 py-2 rounded-lg">
                  ⚠️ {errorMessage}
                </div>
              )}
            </form>
          )}
        </div>
        <div className="flex w-full justify-center space-x-6">
          {!user && (
            <>
              <button
                onClick={handleLogin}
                className="block bg-indigo-200 font-semibold px-6 py-2 rounded-full text-2xl"
              >
                Login
              </button>

              <button
                onClick={handleSignup}
                className="block bg-teal-200 font-semibold px-6 py-2 rounded-full text-2xl"
              >
                Signup
              </button>
            </>
          )}
          {user && (
            <button
              onClick={handleLogout}
              className="block bg-amber-200 font-semibold px-6 py-2 rounded-full text-2xl"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

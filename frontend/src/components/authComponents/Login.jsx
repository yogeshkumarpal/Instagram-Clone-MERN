import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUserApi } from "../../features/actions/AuthActions";
import { axiosIntance } from "../../config/axiosInstance";

const Login = ({ setToggle }) => {
  const dispatch = useDispatch();

  const isEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isMobile = (val) => /^[6-9]\d{9}$/.test(val); // adjust for your locale
  const isUsername = (val) => /^[a-zA-Z0-9_.-]{3,30}$/.test(val);

  function getIdentifierType(value) {
    if (isEmail(value)) return "email";
    if (isMobile(value)) return "mobile";
    if (isUsername(value)) return "username";
    return "unknown";
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let res = dispatch(loginUserApi(data));
    console.log("okk");
  };

  const fetchUserFromGoogleAuth = async () => {
    try {
      let response = await axiosIntance.get("/auth/profile");
      if (response) {
        console.log("comes from google authentication", response);
      }
    } catch (error) {
      console.log("error in google auth");
    }
  };

  // If you want to handle Google auth, trigger `fetchUserFromGoogleAuth` only after
  // the user returns from the OAuth flow (and the cookie has been set).
  // Leaving this commented out avoids noisy 401s on every page load.
  // useEffect(() => {
  //   fetchUserFromGoogleAuth();
  // }, []);

  const handleGoogleAuth = async () => {
    window.location.href = "https://instagram-clone-owi9.onrender.com/api/auth/google";
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded-lg p-8">
        <h1 className="text-4xl font-serif font-bold text-white text-center mb-6">
          Instagram
        </h1>
        <form
          className="flex flex-col gap-3 mb-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            {...register("email", { required: "Required" })}
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            placeholder="Phone number, username, or email"
            type="text"
          />
          {errors.identifier && (
            <span className="text-red-500 text-xs">
              {errors.identifier.message}
            </span>
          )}
          <input
            {...register("password", { required: "Required" })}
            className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500"
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold mt-2"
            type="submit"
          >
            Log in
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-zinc-700"></div>
          <span className="mx-3 text-zinc-400 text-sm font-semibold">OR</span>
          <div className="flex-grow h-px bg-zinc-700"></div>
        </div>
        <button
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-2 text-blue-500 font-semibold mb-2"
          type="button"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            {/* Facebook icon SVG path */}
            <circle cx="12" cy="12" r="12" fill="#2563eb" />
            <path
              d="M13.5 12H12v5H10v-5H9v-2h1v-1c0-1.104.896-2 2-2h1v2h-1c-.552 0-1 .447-1 1v1h2l-.5 2z"
              fill="#fff"
            />
          </svg>
          Log in with Google
        </button>
        <div className="text-center mb-3">
          <a href="#" className="text-blue-400 text-sm font-semibold">
            Forgot password?
          </a>
        </div>
      </div>
      <div className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded-lg p-5 mt-4 text-center">
        <span className="text-zinc-300 text-sm">
          Don't have an account?{" "}
          <p
            onClick={() => setToggle((prev) => !prev)}
            className="text-blue-400 font-semibold"
          >
            Sign up
          </p>
        </span>
      </div>
    </div>
  );
};

export default Login;

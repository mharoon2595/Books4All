import React, { useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../utils/LoadingSpinner.jsx";
import { fetchData, addData } from "../../utils/firebase/userActions.jsx";
import { register } from "../../utils/signedInSlice.js";
import { toggleSignIn } from "../../utils/signedInSlice.js";
import { setUsername } from "../../utils/signedInSlice.js";
import { pushUserId } from "../../utils/idSlice.js";

const UserLogin = () => {
  const signIn = useSelector((state) => state.status.register);
  const [errMsg, setErrMsg] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isRegDisabled, setIsRegDisabled] = useState(true);
  const [inputVal, setInputVal] = useState({
    email: "",
    username: "",
    password: "",
    confirmPass: "",
  });

  const { email, username, password } = inputVal;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setErrMsg(false);
    setInputVal({
      ...inputVal,
      ["username"]: "",
      ["password"]: "",
      ["email"]: "",
      ["confirmPass"]: "",
    });
  }, []);

  useEffect(() => {
    if (username !== "" && password !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    if (username !== "" && password !== "" && email !== "") {
      setIsRegDisabled(false);
    } else {
      setIsRegDisabled(true);
    }
  }, [username, password, email]);

  const loginHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    setIsLoading(true);

    try {
      const data = await fetchData(username, password);
      dispatch(pushUserId(data[1]));
      if (data[0]) {
        await swal("Alright!", "You are now signed in!", "success");
        dispatch(toggleSignIn(true));
        dispatch(setUsername(username));
        navigate("/");
      } else if (!data[0]) {
        throw Error("Invalid credentials");
      }
    } catch (err) {
      const errorMsg = "Invalid credentials";
      setErrMsg(errorMsg);
      await swal("An error occured", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const registerHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username");
    const password = formData.get("password");
    const confirmPass = formData.get("cpassword");
    const email = formData.get("email");

    if (password !== confirmPass) {
      setErrMsg("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const data = await addData(username, password);
      await swal(
        "Alright!",
        "Registered successfully! Please login now",
        "success"
      );

      setInputVal({
        ...inputVal,
        ["username"]: "",
        ["password"]: "",
        ["email"]: "",
      });
    } catch (err) {
      const errorMsg = err.response.data.message;
      setErrMsg(errorMsg);
      await swal("An error occured", errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-96px)] justify-center items-center ">
        <div className="h-[70%] w-[60%] md:max-w-[30%]">
          <div className="relative border-[3px] border-black flex flex-col items-center gap-3 px-4  py-5 rounded-md text-base md:text-xl lg:text-2xl">
            {isLoading && <LoadingSpinner asOverlay />}
            {signIn ? (
              <>
                <div className="text-center text-3xl mb-5">Sign in</div>
                {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}
                <form
                  className="flex flex-col items-center mx-2 max-w-full"
                  onSubmit={loginHandler}
                >
                  <label className="text-base md:text-xl">Username</label>
                  <input
                    className={`p-1 border-[2px] border-black mb-3 w-full rounded-md text-base md:text-xl ${
                      errMsg && "bg-red-200"
                    }`}
                    placeholder="Username"
                    type="text"
                    required
                    name="username"
                    value={inputVal["username"]}
                    onChange={(e) => {
                      setErrMsg("");
                      setInputVal({
                        ...inputVal,
                        ["username"]: e.target.value,
                      });
                    }}
                  />
                  <label className="text-base md:text-xl">Password</label>
                  <input
                    className={`p-1 border-[2px] border-black mb-3 w-full rounded-md text-base md:text-xl ${
                      errMsg && "bg-red-200"
                    }`}
                    placeholder="Password"
                    type="password"
                    required
                    name="password"
                    value={inputVal["password"]}
                    onChange={(e) => {
                      setErrMsg("");
                      setInputVal({
                        ...inputVal,
                        ["password"]: e.target.value,
                      });
                    }}
                    minLength={8}
                  />
                  <button
                    className={`text-center text-base md:text-xl bg-blue-500 p-3 rounded-md ${
                      isDisabled ? "opacity-50" : "opacity-100"
                    }`}
                    type="submit"
                    disabled={isDisabled}
                  >
                    Sign in
                  </button>
                </form>
                <button
                  className="text-center text-base md:text-xl bg-blue-500 p-3 rounded-md "
                  onClick={() => {
                    dispatch(register(false));
                    setInputVal({
                      ...inputVal,
                      ["username"]: "",
                      ["password"]: "",
                      ["email"]: "",
                    });
                  }}
                >
                  New user? Sign up!
                </button>
              </>
            ) : (
              <>
                <div className="text-center text-3xl mb-5">Register</div>
                {errMsg && <p className="text-red-500 text-center">{errMsg}</p>}
                <form
                  className="flex flex-col items-center mx-2"
                  onSubmit={registerHandler}
                >
                  <label className="text-xl">Email ID</label>
                  <input
                    className={`p-1 border-[2px] border-black mb-3 w-full rounded-md text-base md:text-xl ${
                      errMsg && "bg-red-200"
                    }`}
                    placeholder="Email"
                    type="email"
                    required
                    name="email"
                    value={inputVal["email"]}
                    onChange={(e) => {
                      setErrMsg("");
                      setInputVal({ ...inputVal, ["email"]: e.target.value });
                    }}
                  />
                  <label className="text-xl">Username</label>
                  <input
                    className={`p-1 border-[2px] border-black mb-3 w-full rounded-md text-base md:text-xl ${
                      errMsg && "bg-red-200"
                    }`}
                    placeholder="Username"
                    type="text"
                    required
                    name="username"
                    value={inputVal["username"]}
                    onChange={(e) => {
                      setErrMsg("");
                      setInputVal({
                        ...inputVal,
                        ["username"]: e.target.value,
                      });
                    }}
                  />
                  <label className="text-xl">Password</label>
                  <input
                    className={`p-1 border-[2px] border-black mb-3 w-full rounded-md text-base md:text-xl ${
                      errMsg && "bg-red-200"
                    }`}
                    placeholder="Password"
                    type="password"
                    required
                    name="password"
                    value={inputVal["password"]}
                    onChange={(e) => {
                      errMsg && setErrMsg("");
                      setInputVal({
                        ...inputVal,
                        ["password"]: e.target.value,
                      });
                    }}
                    minLength={8}
                  />
                  <input
                    className={`p-1 border-[2px] border-black mb-3 w-full rounded-md text-base md:text-xl ${
                      errMsg && "bg-red-200"
                    }`}
                    placeholder="Confirm Password"
                    type="password"
                    required
                    name="cpassword"
                    value={inputVal["confirmPass"]}
                    onChange={(e) => {
                      errMsg && setErrMsg("");
                      setInputVal({
                        ...inputVal,
                        ["confirmPass"]: e.target.value,
                      });
                    }}
                    minLength={8}
                  />
                  <button
                    className={`text-center text-base md:text-xl bg-blue-500 p-3 rounded-md ${
                      isRegDisabled ? "opacity-50" : "opacity-100"
                    }`}
                    type="submit"
                    disabled={isRegDisabled}
                  >
                    Register
                  </button>
                </form>
                <button
                  className={`text-center text-base md:text-xl bg-blue-500 p-3 rounded-md `}
                  onClick={() => {
                    dispatch(register(true));
                    setInputVal({
                      ...inputVal,
                      ["username"]: "",
                      ["password"]: "",
                      ["email"]: "",
                    });
                  }}
                >
                  Already have an account? Sign in!
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserLogin;

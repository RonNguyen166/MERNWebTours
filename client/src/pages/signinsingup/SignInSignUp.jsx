import { useState } from "react";
import Login from "../../components/login/login";
import Register from "../../components/register/register";
import "./signinsignup.scss";

const SignInSignUp = ({ signup }) => {
  const [modef, setModef] = useState(signup ? signup : "");
  return (
    <div className="login">
      <div class={"containers " + modef}>
        <div class="forms-container">
          <div class="signin-signup">
            <Login />
            <Register />
          </div>
        </div>

        <div class="panels-container">
          <div class="panel left-panel">
            <div class="content">
              <h3>New here ?</h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Debitis, ex ratione. Aliquid!
              </p>
              <btn
                class="btn transparent"
                id="sign-up-btn"
                onClick={() => setModef("sign-up-mode")}
              >
                Sign up
              </btn>
            </div>
            <img src="./imgCover/log.svg" class="image" alt="" />
          </div>
          <div class="panel right-panel">
            <div class="content">
              <h3>One of us ?</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
                laboriosam ad deleniti.
              </p>
              <btn
                class="btn transparent"
                id="sign-in-btn"
                onClick={() => setModef("")}
              >
                Sign in
              </btn>
            </div>
            <img src="./imgCover/register.svg" class="image" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInSignUp;

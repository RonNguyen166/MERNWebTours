import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as bicons from "@fortawesome/free-brands-svg-icons";

import "./login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      console.log({ credentials })
      const res = await axios.post("/auth/login", credentials);
      console.log(res);
      if (res.data.success) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.result.user });
        navigate("/");
      }
      alert(res.data.message);
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR", payload: err.response.data });
    }
  };
  return (
    <form action="#" className="sign-in-form">
      <h2 className="title">Sign in</h2>
      <div className="input-field">
        <i className="fas fa-user"></i>
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
      </div>
      <input
        type="submit"
        value="Login"
        className="btn solid"
        onClick={handleClick}
      />
      <p className="social-text">Or Sign in with social platforms</p>
      <div className="social-media">
        <Link to="#" className="social-icon">
          <FontAwesomeIcon icon={bicons.faFacebookF} />
        </Link>
        <Link to="#" className="social-icon">
          <FontAwesomeIcon icon={bicons.faGoogle} />
        </Link>
      </div>
    </form>
  );
};
export default Login;

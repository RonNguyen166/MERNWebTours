import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as bicons from "@fortawesome/free-brands-svg-icons";
const Register = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
  });
  const [msg, setMsg] = useState("");
  const { user, loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", credentials);
      if (res.data.status === "success") {
        dispatch({ type: "REGISTER", payload: res.data.data });
        navigate("/");
      }
      alert(res.data.message);
    } catch (err) {
      alert(err.data.message);
    }
  };

  return (
    <form action="#" className="sign-up-form">
      <h2 className="title">Sign up</h2>
      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="text"
          placeholder="Username"
          name="username"
          onChange={handleChange}
        />
      </div>
      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
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
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Confirm password"
          name="passwordConfirm"
          onChange={handleChange}
        />
      </div>
      <input
        type="submit"
        className="btn"
        value="Sign up"
        onClick={handleClick}
      />
      <p className="social-text">Or Sign up with social platforms</p>
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

export default Register;

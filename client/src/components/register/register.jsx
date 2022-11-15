import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form"
import * as bicons from "@fortawesome/free-brands-svg-icons";

import "./register.scss";

const Register = () => {
  const [credentials, setCredentials] = useState({

    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
  });
  const { loading, error, dispatch } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm()
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/auth/register", data);
      if (res.data.success) {
        dispatch({ type: "REGISTER", payload: res.data.result.user });
        navigate("/login");
      }
      alert(res.data.message);
    } catch (err) {
      alert(err.response.data.message);
    }


  };

  return (
    <form action="#" className="sign-up-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="title">Sign up</h2>

      <div className="input-field">
        <i className="fas fa-envelope"></i>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: true })}
        />
      </div>
      {errors.email && <p className="fieldError">This field is required</p>}
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Password"
          {...register("password", { required: true, minLength: 6, pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/ })}
        />

      </div>
      {errors.password?.type === "required" && <p className="fieldError">**This field is required</p>}
      {errors.password?.type === "minLength" && <p className="fieldError">**Password must min lenght 6</p>}
      {errors.password?.type === "pattern" && <p className="fieldError">**Password must contain at least one letter and one number</p>}
      <div className="input-field">
        <i className="fas fa-lock"></i>
        <input
          type="password"
          placeholder="Confirm password"
          {...register("passwordConfirm", { required: true, validate: (value) => value === getValues("password") })}
        />
      </div>
      {errors.passwordConfirm?.type === "required" && <p className="fieldError">**This field is required</p>}
      {errors.passwordConfirm?.type === "validate" && <p className="fieldError">**Confirm Password not match</p>}
      <input
        type="submit"
        className="btn"
        value="Sign up"
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

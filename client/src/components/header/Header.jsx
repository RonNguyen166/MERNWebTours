import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";

import "./header.scss";

const Header = ({ type }) => {
  const navigate = useNavigate();
  const { user, loading, error, dispatch } = useContext(AuthContext);

  const handleClickLogout = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    try {
      const res = await axios.get("/auth/logout");
      console.log(res.data.data);
      if (res.data.status === "success") {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="header">
      <div className="blockTop">
        <div className={type === "list" ? "container listMode" : "container"}>
          <div className="navbar navbar-expand-md navbar-light">
            <div className="container-fluid">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarNav"
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <FontAwesomeIcon
                        className="icon"
                        icon={icons.faPercent}
                      />
                      Khuyến mãi
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <FontAwesomeIcon
                        className="icon"
                        icon={icons.faTableList}
                      />
                      Đặt chỗ của tôi
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <FontAwesomeIcon
                        className="icon"
                        icon={icons.faHeadset}
                      />
                      Trung tâm trợ giúp
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <FontAwesomeIcon
                        className="icon"
                        icon={icons.faHandshake}
                      />
                      Hợp tác với chúng tôi
                    </Link>
                  </li>
                </ul>
                <ul className="navbar-nav nav-right">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      <FontAwesomeIcon className="icon" icon={icons.faPhone} />
                      <b style={{ fontSize: 15 }}>0123456789</b>
                    </Link>
                    <Link className="nav-link" to="/">
                      <FontAwesomeIcon className="icon" icon={icons.faClock} />
                      8h{" "}
                      <FontAwesomeIcon
                        className="icon"
                        icon={icons.faArrowRightLong}
                      />{" "}
                      16h |{" "}
                      <FontAwesomeIcon
                        className="icon"
                        icon={icons.faLocationDot}
                      />{" "}
                      Đà Nẵng <FontAwesomeIcon icon={icons.faAngleDown} />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="blockBottom">
        <div className="container">
          <div className="navbar">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                <span>Tour</span>.ink
              </Link>
              <ul className="nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Khuyến mãi
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Du lịch
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Vé máy bay
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Ăn uống
                  </Link>
                </li>
              </ul>
              {(!user && (
                <div>
                  <Link className="btn" to="/login">
                    Đăng Nhập
                  </Link>
                  <Link className="btn btn-mgreen" to="/register">
                    Đăng Kí
                  </Link>
                </div>
              )) || (
                <div className="profile">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="btn-drop"
                    >
                      <img
                        src={"./img/users/" + user.photo}
                        alt=""
                        className="u-photo"
                      />
                      <span className="u-name">{user.username}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="menu">
                      <Link to="/">Cài đặt thông tin</Link>
                      <Link to="/">Tours đã đặt</Link>
                      <Link to="/" onClick={handleClickLogout}>
                        Đăng xuất
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

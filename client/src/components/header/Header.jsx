import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SearchContext } from "../../context/SearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";

import "./header.scss";

const Header = ({ type }) => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDates] = useState(Date.now());
  // const [openLocation, setOpenLocation] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(SearchContext);
  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, date, startLocation },
    });
    navigate("/tours", { state: { destination, date, startLocation } });
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
                    {/* <Link className="nav-link" to="/">
                      Pricing
                    </Link> */}
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
              {!user && (
                <div>
                  <btn className="btn">Đăng Nhập</btn>
                  <btn className="btn btn-mgreen">Đăng Kí</btn>
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

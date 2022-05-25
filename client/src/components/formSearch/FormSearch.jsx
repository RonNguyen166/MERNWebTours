import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";

import * as icons from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "./formSearch.scss";

const FormSearch = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [guests, setGuests] = useState(2);
  const [startDate, setStartDate] = useState(new Date());
  // const [openLocation, setOpenLocation] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);
  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, startDate, guests },
    });
    navigate("/tours", {
      state: { departure, destination, startDate, guests },
    });
  };
  return (
    <div className="body-search">
      <div className="row">
        <div className="col-3 search-item">
          <p>
            <FontAwesomeIcon className="icon" icon={icons.faLocationDot} />
            Departure
          </p>
          <input
            type="text"
            className="form-control"
            placeholder="Điểm khởi hành?"
            onChange={(departure) => setDeparture(departure)}
          />
          <div className="line"></div>
        </div>
        <div className="col-3 search-item">
          <p>
            <FontAwesomeIcon className="icon" icon={icons.faLocationDot} />
            Location
          </p>
          <input
            type="text"
            className="form-control"
            placeholder="Bạn muốn đi đâu?"
            onChange={(destination) => setDestination(destination)}
          />
          <div className="line"></div>
        </div>
        <div className="col-3 search-item">
          <p>
            <FontAwesomeIcon className="icon " icon={icons.faCalendarDays} />
            Date
          </p>

          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="date-picker"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="col-2 search-item">
          <p>
            <FontAwesomeIcon className="icon" icon={icons.faUserPlus} />
            Guests
          </p>
          <div className="from-guests">
            <btn className="btn1 ">
              <FontAwesomeIcon
                className="icon"
                icon={icons.faMinus}
                onClick={() => (guests !== 1 ? setGuests(guests - 1) : guests)}
              />
            </btn>
            <div className="form-add-people">
              <span className="quatity">{guests}</span>
              {/* <span> guests</span> */}
            </div>
            <btn className="btn1">
              <FontAwesomeIcon
                className="icon"
                icon={icons.faPlus}
                onClick={() => setGuests(guests + 1)}
              />
            </btn>
          </div>
        </div>
        <div className="col-1 search-item">
          <btn type="submit" className="btn1 sumbit" onClick={handleSearch}>
            <FontAwesomeIcon className="icon" icon={icons.faMagnifyingGlass} />
          </btn>
        </div>
      </div>
    </div>
  );
};

export default FormSearch;

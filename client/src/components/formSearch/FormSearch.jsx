import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateRange } from "react-date-range";
import * as icons from "@fortawesome/free-solid-svg-icons";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";

import "./formSearch.scss";

const FormSearch = () => {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [guests, setGuests] = useState(2);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  // const [openLocation, setOpenLocation] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(SearchContext);
  const handleSearch = () => {
    dispatch({
      type: "NEW_SEARCH",
      payload: { destination, dates, guests },
    });
    navigate("/tours", { state: { destination, dates, guests } });
  };
  return (
    <div className="body-search">
      <div className="row">
        <div className="col-4 search-item">
          <p>
            <FontAwesomeIcon className="icon" icon={icons.faLocationDot} />
            Location
          </p>
          <input
            type="text"
            className="form-control"
            placeholder="Bạn muốn đi đâu?"
          />
          <div className="line"></div>
        </div>
        <div className="col-4 search-item">
          <p>
            <FontAwesomeIcon className="icon " icon={icons.faCalendarDays} />
            Date
          </p>
          <span onClick={() => setOpenDate(!openDate)} className="text-search">
            {`${format(dates[0].startDate, "MM/dd/yyyy")} `}{" "}
            <FontAwesomeIcon icon={icons.faArrowsLeftRight} />{" "}
            {` ${format(dates[0].endDate, "MM/dd/yyyy")}`}{" "}
            <FontAwesomeIcon
              style={{ marginLeft: 18 }}
              icon={icons.faAngleDown}
            />
          </span>
          {openDate && (
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDates([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dates}
              className="date"
              minDate={new Date()}
            />
          )}
        </div>
        <div className="col-3 search-item">
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
              <span> guests</span>
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
          <btn className="btn1 sumbit" onClick={handleSearch}>
            <FontAwesomeIcon className="icon" icon={icons.faMagnifyingGlass} />
          </btn>
        </div>
      </div>
    </div>
  );
};

export default FormSearch;

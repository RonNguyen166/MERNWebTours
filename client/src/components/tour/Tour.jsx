import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from "@fortawesome/free-solid-svg-icons";
import "./tour.scss";
const Tour = ({ item }) => {
  const location = item.location?.split(",");

  return (
    <div className="col-md-3">
      <div className="card">
        <div className="img-card">
          <img src={`./img/tours/${item.images[0]}`} alt="" />
        </div>
        <div className="content">
          <h5 className="title">{item.name}</h5>
          <p className="sub-title">{item.summary}</p>
          <div className="descr">
            <div className="location">
              <FontAwesomeIcon className="icon" icon={icons.faLocationDot} />
              {location?.[location.length - 1]}
            </div>
            <div className="price">
              <FontAwesomeIcon className="icon" icon={icons.faDollarSign} />

              {item.priceDiscount ? (
                <div className="cus">
                  <p className="t-price">{item.price} VND</p>
                  <p className="price-discount">{item.priceDiscount} VND</p>
                </div>
              ) : (
                <p className="t-price">{item.price} VND</p>
              )}
            </div>
          </div>
        </div>
        <btn type="button" className="btn-nav">
          Plan Trip Now{" "}
          <FontAwesomeIcon className="icon" icon={icons.faArrowRightLong} />
        </btn>
      </div>
    </div>
  );
};
export default Tour;

import "./footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="row">
          <div className="col-sm-4 ">
            <div className="heading">
              <h5>
                <span>Tour</span>.ink
              </h5>
              <p>Enjoy the touring with Tourink</p>
            </div>
          </div>
          <div className="col-sm-2 ">
            <div className="heading">
              <h5>Menu</h5>
              <Link className="link" to="/">
                Home
              </Link>
              <Link className="link" to="/">
                About Us
              </Link>
            </div>
          </div>
          <div className="col-sm-2 ">
            <div className="heading">
              <h5>Booking Plan</h5>
              <Link className="link" to="/">
                Personal Trip
              </Link>
              <Link className="link" to="/">
                Group Trip
              </Link>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="heading">
              <h5>Futher Information</h5>
              <Link className="link" to="/">
                Terms & Conditions
              </Link>
              <Link className="link" to="/">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="heading">
              <h5>Get App</h5>
              <Link className="link" to="/">
                App Store
              </Link>
              <Link className="link" to="/">
                Google Play Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

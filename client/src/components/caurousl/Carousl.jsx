import "./carousl.scss";
import useFetch from "../../hooks/useFetch";
import FormSearch from "../formSearch/FormSearch";

const Carousl = () => {
  const { data, loading, error } = useFetch("/tours?limit=4&sort=createdAt");
  return (
    <div className="main-search">
      <div className="container">
        {loading ? (
          <div className="heading" style={{ textAlign: "center" }}>
            <h2>Loading...</h2>
          </div>
        ) : (
          <div className="container-fluid">
            <div
              id="carouselExampleCaptions"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-indicators">
                <btn
                  type="submit"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></btn>
                <btn
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></btn>
                <btn
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></btn>
                <btn
                  type="button"
                  data-bs-target="#carouselExampleCaptions"
                  data-bs-slide-to="3"
                  aria-label="Slide 4"
                ></btn>
              </div>
              <div className="carousel-inner">
                {data.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className={i ? "carousel-item" : "carousel-item active"}
                    >
                      <img src={"../img/tours/" + item.images[0]} alt="" />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>{item.summary}</h5>
                        <h1>{item.name}</h1>
                        <p className="price">
                          {item.priceDiscount ? (
                            <>
                              <span stype={{ textDecoration: "line-through" }}>
                                {item.priceDiscount} VND |{" "}
                              </span>
                              <span>{item.price} VND</span>
                            </>
                          ) : (
                            <span>{item.price} VND</span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <btn
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </btn>
              <btn
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </btn>
            </div>
            <FormSearch />
          </div>
        )}
      </div>
    </div>
  );
};

export default Carousl;

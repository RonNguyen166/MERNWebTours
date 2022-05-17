import { Splide, SplideSlide } from "@splidejs/react-splide";
import "./categories.scss";
const Categories = () => {
  return (
    <div className="categories">
      <div className="container">
        <div className="heading">
          <h2>Thể Loại</h2>
          <p>Những thể loại du dịch mà bán muốn đi!</p>
        </div>

        <Splide
          options={{
            rewind: true,
            gap: "3em",
            autoWidth: true,
            pagination: false,
          }}
          aria-label="My Favorite Images"
          className="splide"
          tap="section"
        >
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Biển</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
          <SplideSlide className="slide">
            <img src="./imgCover/bien.jpg" alt="" />
            <h5>Chùa</h5>
          </SplideSlide>
        </Splide>
      </div>
    </div>
  );
};

export default Categories;

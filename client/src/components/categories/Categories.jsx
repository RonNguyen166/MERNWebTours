import { Splide, SplideSlide } from "@splidejs/react-splide";
import useFetch from "../../hooks/useFetch";
import "./categories.scss";
const Categories = () => {
  const { result, loading, error } = useFetch("/category");
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
            gap: "3.5em",
            autoWidth: true,
            pagination: false,
          }}
          aria-label="My Favorite Images"
          className="splide"
          tap="section"
        >
          {result.data?.map((item) => {
            return (
              <SplideSlide key={item._id} className="slide">
                <img src={"./img/categories/" + item.image} alt="" />
                <h5>{item.name}</h5>
              </SplideSlide>
            );
          })}
        </Splide>
      </div>
    </div>
  );
};

export default Categories;

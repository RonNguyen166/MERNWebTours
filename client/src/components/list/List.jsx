import "./list.scss";
import useFetch from "../../hooks/useFetch";
import Tour from "../tour/Tour";

const List = () => {
  const { data, loading, error } = useFetch("/tours?limit=8&sort=createdAt");
  return (
    <div className="list">
      <div className="container">
        {loading ? (
          <div className="heading">
            <h2>Loading...</h2>
          </div>
        ) : (
          <>
            <div className="heading">
              <h2>Điểm Đến Hàng Đầu</h2>
              <p>
                Nhiều nơi phù hợp với tâm trạng của bạn. Khám phá một nơi nào đó
                thú vị và tận hưởng những rung cảm!
              </p>
            </div>
            <div className="wrap">
              <div className="row">
                {data.map((el) => (
                  <Tour item={el} key={el.id} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default List;

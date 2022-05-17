import { keySearch } from "../../content/keySearch";
import "./popular.scss";
const Popular = () => {
  return (
    <div className="popular-search">
      <div className="container">
        <h3>Popular Search</h3>
        <div className="block">
          {keySearch.map((item, i) => {
            return (
              <btn className="btn btn-search" key={i}>
                {item}
              </btn>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Popular;

import FormSearch from "../../components/formSearch/FormSearch";
import Header from "../../components/header/Header";
import "./tours.scss";
const Tours = () => {
  return (
    <>
      <Header />
      <div className="main-search">
        <div className="container">
          <FormSearch />
        </div>
      </div>
    </>
  );
};
export default Tours;

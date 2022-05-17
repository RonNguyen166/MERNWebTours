import App from "../../components/downloadapp/DownloadApp";
import Categories from "../../components/categories/Categories";
import Carousl from "../../components/caurousl/Carousl";
import Header from "../../components/header/Header";
import Intro from "../../components/intro/Intro";
import List from "../../components/list/List";
import Popular from "../../components/poupular/Popular";
import Footer from "../../components/footer/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Carousl />
      <Popular />
      <Categories />
      <List />
      <Intro />
      <App />
      <Footer />
    </>
  );
};

export default Home;

import "./intro.scss";
const Intro = () => {
  return (
    <div className="intro">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src="./imgCover/intros.svg" alt="" />
          </div>
          <div className="col-md-6">
            <div className="heading">
              <h2>
                Why Choose <span>Tour</span>.ink?
              </h2>
              <p>
                Tourink has cooperated with country that provide more than 600
                beautiful place for you to enjoy and relax your free time from
                the hustle and bustle of this life. Don't be worry, you won't
                get loss because Tourink provide 100+ professional Tour Guide
                also. Our 5.k+ customers were satisfied with the services we
                provide. So what are you waiting for? Let's plan your holiday
                with us!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Intro;

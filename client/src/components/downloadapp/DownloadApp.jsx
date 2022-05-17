import "./downloadapp.scss";

const App = () => {
  return (
    <div className="download-app">
      <div className="container">
        <div className="content">
          <div className="heading">
            <h2>
              Download the <span>Tour</span>.ink app, now!
            </h2>
            <p>Get the latest update from us and easier booking for sure</p>
          </div>
          <div className="btns">
            <btn>
              <img src="./imgCover/appiphone.png" alt="" />
            </btn>
            <btn>
              <img src="./imgCover/appandroid.png" alt="" />
            </btn>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;

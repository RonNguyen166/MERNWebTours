import "./App.scss";
import "@splidejs/react-splide/css";
import "bootstrap/dist/js/bootstrap.js";

import Home from "./pages/home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Tours from "./pages/tours/Tours";
import SignInSignUp from "./pages/signinsingup/SignInSignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/login" element={<SignInSignUp />} />
        <Route
          path="/register"
          element={<SignInSignUp signup={"sign-up-mode"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

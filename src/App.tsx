import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Nav from "./components/Nav";

function App() {
  return (
    <>
      <HashRouter basename="/">
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<p>Not Found</p>} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;

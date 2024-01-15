import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav className="border h-[8vh] flex justify-center items-center  px-5">
      <Link
        to="/"
        className="text-3xl text-gray-900 font-bold font-poppins"
      >
        Task<span className="text-blue-600">Flow</span>
      </Link>
    </nav>
  );
}

export default Nav;

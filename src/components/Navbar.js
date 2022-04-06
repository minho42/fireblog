import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <nav>
      <div className="flex items-center justify-between bg-purple-100 px-10 py-4">
        <div>
          <Link to="/">
            <div className="font-semibold">🔥 fireblog</div>
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link to="/">
            <div className="font-semibold">posts</div>
          </Link>
          <Link to="/login">
            <div className="font-semibold">login</div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

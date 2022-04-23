import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";

export const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav>
      <div className="flex items-center justify-between bg-purple-100 text-xl px-10 h-16 space-x-6">
        <div>
          <Link to="/">
            <div className="font-semibold">🔥 fireblog</div>
          </Link>
        </div>
        {user && <div>{user.email}</div>}
        <div className="flex space-x-6">
          <Link to="/">
            <div className="font-semibold px-4 py-2 rounded-full hover:bg-purple-200 transform duration-150 ">
              posts
            </div>
          </Link>
          <Link to="/auth">
            <div className="font-semibold px-4 py-2 rounded-full hover:bg-purple-200 transform duration-150 ">
              auth
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

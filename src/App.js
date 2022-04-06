import { UserProvider } from "./components/UserContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { Navbar } from "./components/Navbar";
import { PostList } from "./components/PostList";
import { Login } from "./components/Login";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PostList />
              </PrivateRoute>
            }
          />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;

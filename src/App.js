import { UserProvider } from "./components/UserContext";
import { Navbar } from "./components/Navbar";
import { PostList } from "./components/PostList";
import { Auth } from "./components/Auth";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <UserProvider>
        <Navbar />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<PostList />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;

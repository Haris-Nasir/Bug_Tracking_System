import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";
import Signup from "./components/Auth/Signup";
import Login from "./components/auth/Login";
import Projectlist from "./components/Dashboard/projectlist";
import Buglist from "./components/Dashboard/buglist";

function App() {
  return (
    <ApolloProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/projectlist" element={<Projectlist />} />
          <Route path="/buglist" element={<Buglist />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;

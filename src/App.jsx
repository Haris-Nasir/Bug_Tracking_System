import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApolloProvider from "./ApolloProvider";
import Signup from "./components/Auth/Signup";
import Developer from "./components/Dashboard/developer";
import Manager from "./components/Dashboard/manager";
import Login from "./components/auth/Login";

function App() {
  return (
    <ApolloProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/manager" element={<Manager />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;

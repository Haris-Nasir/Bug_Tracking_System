import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

// Define the login query using Apollo Client
const LOGIN_QUERY = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jwtToken, setJwtToken] = useState("");

  // Apollo query hook for login
  const { data, loading, error } = useQuery(LOGIN_QUERY, {
    variables: { email, password },
    skip: !email || !password, // Only run the query if email and password are provided
  });

  const handleLogin = async () => {
    if (loading) return; // Wait for the query to complete
    if (error) {
      console.error("Login error:", error);
      return;
    }

    if (data?.login) {
      const token = data.login; // JWT token
      setJwtToken(token);
      console.log("Authentication successful! JWT Token:", token);
      await fetchRole(token); // Fetch the user's role using the token
    } else {
      console.error("Invalid credentials. Please try again.");
    }
  };

  const fetchRole = async (token) => {
    const securedResourceQuery = `
      {
        securedResource
      }
    `;

    try {
      const roleResponse = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: securedResourceQuery }),
      });

      const roleResult = await roleResponse.json();

      if (roleResponse.ok && roleResult?.data?.securedResource) {
        const userData = JSON.parse(roleResult.data.securedResource);
        localStorage.setItem("user", userData);
        if (userData.role == "developer" || userData.role == "manager") {
          navigate("/projectlist");
        } else {
          navigate("/buglist");
        }
      } else {
        console.log("Failed to fetch user role. Authentication failed.");
      }
    } catch (error) {
      console.error("Error during role fetching:", error);
      console.log("Something went wrong while verifying the role.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white px-10 py-20 rounded-3xl border-2 border-gray-100 w-full sm:w-96">
        <h1 className="text-5xl font-semibold text-center">Welcome Back</h1>
        <p className="font-medium text-lg text-gray-500 mt-5 text-center">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mt-8">
            <label className="text-lg font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div className="mt-8">
            <label className="text-lg font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              placeholder="Enter your password"
            />
          </div>

          <div className="mt-8 flex justify-between">
            <div>
              <input type="checkbox" id="remember" />
              <label className="ml-2 font-medium text-base" htmlFor="remember">
                Remember for 30 days
              </label>
            </div>
            <button className="font-medium text-base text-violet-500">
              Forgot password
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-y-4">
            <button
              onClick={handleLogin}
              className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-3 rounded-xl bg-violet-500 text-white text-lg font-bold"
            >
              Sign In
            </button>
            <button
              className="border-2 border-gray-100 py-3 rounded-xl active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-8 flex justify-center items-center">
            <p className="font-medium text-base">Don't have an account?</p>
            <button
              className="text-violet-500 text-base font-medium ml-2"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

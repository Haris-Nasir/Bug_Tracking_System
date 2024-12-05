import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider as Provider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql", // Replace with your GraphQL server URI
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`, // Optional: include JWT token for authenticated requests
  },
});

const ApolloProvider = ({ children }) => {
  return <Provider client={client}>{children}</Provider>;
};

export default ApolloProvider;

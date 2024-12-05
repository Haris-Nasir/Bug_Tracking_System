import React from "react";

const Developer = () => {
  const items = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <h1>{items.email}</h1>
      <h1>{items.role}</h1>
    </div>
  );
};

export default Developer;

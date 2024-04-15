import React from "react";
import { UserAuth } from "../context/AuthContext";
import Kühlschrank from "../components/kühlschrank";

const Account = () => {
  const { user } = UserAuth();

  return (
    <>
      <h2>Welcome, {user?.displayName}</h2>
      <Kühlschrank />
    </>
  );
};

export default Account;
// Kommentar
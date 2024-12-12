/* eslint-disable */

"use client";

import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

const BackButton = ({ route }) => {
  const router = useRouter();

  const handleBack = () => {
    router.push(route);
  };

  return (
    <button
      onClick={handleBack}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        fontSize: "16px",
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#007bff",
      }}
    >
      <FaArrowLeft style={{ marginRight: "5px" }} />
      Back
    </button>
  );
};

export default BackButton;

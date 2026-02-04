"use client";
import dynamic from "next/dynamic";

const InputMask = dynamic(() => import("react-input-mask"), {
  ssr: false,
});

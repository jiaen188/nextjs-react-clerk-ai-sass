"use client";

import { useState, useEffect } from "react";

import ProModal from "@/components/ProModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ProModal></ProModal>
    </>
  );
};

export default ModalProvider;

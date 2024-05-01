// page.js
'use client';

import Image from "next/image";
import React from "react";
import CandlestickChart from "./components/CandlestickChart";

export default function Home() {
  return (
    <main >
      <CandlestickChart />
    </main>
  );
}

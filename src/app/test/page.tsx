'use client'

import FlutteringLetter from "@/components/test/FlutteringLetter";
import ScaleTilt from "@/components/test/ScaleTilt";

export default function TestPage() {
  return (
    <div className="w-full h-dvh overflow-hidden">
      <ScaleTilt/>
      <FlutteringLetter/>
    </div>
  );
}
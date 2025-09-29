"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./MapClient"), { ssr: false });

type Props = {
  dataUrl?: string;
};

export default function MapWrapper({ dataUrl }: Props) {
  return <MapClient dataUrl={dataUrl} />;
}

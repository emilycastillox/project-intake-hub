import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Intake Hub",
  description: "Internal work request intake and triage system",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: React.FC<Props> = (props) => {
  const { children } = props;

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;

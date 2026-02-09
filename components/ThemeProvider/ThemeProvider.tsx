"use client";

import React from "react";
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";

interface Props extends ThemeProviderProps {}

const ThemeProvider: React.FC<Props> = (props) => {
  const { children, ...rest } = props;

  return <NextThemesProvider {...rest}>{children}</NextThemesProvider>;
};

export { ThemeProvider };

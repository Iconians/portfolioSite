"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export function ThemeDecorator({
  theme,
  children,
}: {
  theme: string;
  children: React.ReactNode;
}) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return children;
}

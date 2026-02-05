"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";

export default function SignInBackdrop() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-60 dark:opacity-35 pointer-events-none">
        <Dithering
          style={{ width: "100%", height: "100%" }}
          colorBack={isDark ? "#0D0A0A" : "#ffffff"}
          colorFront="#00ffbf"
          shape="warp"
          type="4x4"
          size={1.1}
          speed={0.08}
          scale={2.05}
          offsetX={0.9}
        />
      </div>
      <div className="absolute -top-24 right-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-[-80px] left-[-40px] h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--border)_1px,transparent_0)] [background-size:24px_24px] opacity-30 dark:opacity-20" />
    </div>
  );
}

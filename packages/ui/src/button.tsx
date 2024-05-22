"use client";

import { ReactNode } from "react";
import Link from 'next/link'

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className, appName }: ButtonProps) => {
  return (
    <Link href="/game">
      <button
        className={className}

      >
        {children}
      </button>
    </Link>
  );
};

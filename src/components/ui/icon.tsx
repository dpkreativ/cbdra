"use client";

import { Icon as CustomIcon } from "@iconify-icon/react";

export function Icon({
  icon,
  width,
  height,
  className,
}: {
  icon: string;
  width?: string;
  height?: string;
  className?: string;
}) {
  return (
    <CustomIcon
      icon={icon}
      width={width}
      height={height}
      className={className}
    />
  );
}

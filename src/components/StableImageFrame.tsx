import type { CSSProperties } from "react";

type StableImageFrameProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  position?: string;
};

export function StableImageFrame({
  src,
  alt = "",
  className,
  style,
  position = "center",
}: StableImageFrameProps) {
  return (
    <div
      aria-hidden={alt ? undefined : true}
      aria-label={alt || undefined}
      className={className}
      role={alt ? "img" : undefined}
      style={{
        backgroundColor: "#d8cebf",
        backgroundImage: `url("${src}")`,
        backgroundPosition: position,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        ...style,
      }}
    />
  );
}

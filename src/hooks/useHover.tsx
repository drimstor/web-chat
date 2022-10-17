import React from "react";

export default function useHover(ref: any) {
  const [isHovering, setHovering] = React.useState<boolean>(false);

  const on: () => void = () => setHovering(true);
  const off: () => void = () => setHovering(false);

  React.useEffect(() => {
    if (!ref.current) {
      return;
    }
    const node = ref.current;

    node.addEventListener("mouseenter", on);
    node.addEventListener("mousemove", on);
    node.addEventListener("mouseleave", off);

    return function () {
      node.removeEventListener("mouseenter", on);
      node.removeEventListener("mousemove", on);
      node.removeEventListener("mouseleave", off);
    };
  }, []);
  return isHovering;
}

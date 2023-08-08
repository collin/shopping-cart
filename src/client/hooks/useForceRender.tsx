import { useEffect, useState } from "react";

/**
 * Returns a function that forces a component to re-render.
 *
 * This is useful for components that need to re-render when values change
 * that are not part of component state.
 *
 * For example, if a component needs to re-render when some part of the DOM
 * changes. For example, using the validity api of a form input.
 *
 * This hook will cause the component to re-render when the component mounts,
 * because ref.current is always null on the first render.
 *
 * NOTE: This is not a good pattern for most components. It is better to
 * use component state to track values that need to trigger a re-render. It
 * should only be used when ther is no other way to get the values out of the
 * ref and into state.
 *
 * @returns A function that forces a component to re-render
 */
export const useForceRender = () => {
  const [count, setCount] = useState(0);
  const forceRender = () => setCount(count + 1);
  useEffect(forceRender, []);
  return forceRender;
};

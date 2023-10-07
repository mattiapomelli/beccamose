import { ChangeEvent, useEffect } from "react";
import { flushSync } from "react-dom";
import { useDarkMode, useIsMounted } from "usehooks-ts";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

const enableTransitions = () =>
  "startViewTransition" in document && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { isDarkMode, toggle } = useDarkMode();
  const isMounted = useIsMounted();

  const toggleThemeWithAnimation = async (event?: ChangeEvent<HTMLInputElement> | MouseEvent) => {
    if (!enableTransitions()) {
      toggle();
      return;
    }

    let x: number;
    let y: number;

    // default values start animating theme change from the page center
    const defaultX = innerWidth / 2;
    const defaultY = innerHeight / 2;

    if (!event) {
      x = defaultX;
      y = defaultY;
    } else {
      // @ts-expect-error
      const rect = event.target?.getBoundingClientRect?.();

      if (rect && typeof rect.x === "number" && typeof rect.y === "number") {
        x = rect.x + rect.width / 2;
        y = rect.y + rect.height / 2;
      } else {
        x = defaultX;
        y = defaultY;
      }
    }

    // Get the distance to the furthest corner
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

    // @ts-expect-error
    const transition = document.startViewTransition(async () => {
      flushSync(() => {
        toggle();
      });
    });

    const animateFromMiddle = async (transition: any) => {
      try {
        await transition.ready;

        document.documentElement.animate(
          { clipPath: !isDarkMode ? clipPath.reverse() : clipPath },
          {
            duration: 500,
            easing: "ease-in",
            pseudoElement: `::view-transition-${!isDarkMode ? "old" : "new"}(root)`,
          },
        );
      } catch (e) {
        console.error(e);
      }
    };

    animateFromMiddle(transition);

    await transition.finished;
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDarkMode ? "scaffoldEthDark" : "scaffoldEth");
  }, [isDarkMode]);

  return (
    <div className={`flex space-x-2 text-sm ${className}`}>
      <input
        id="theme-toggle"
        type="checkbox"
        className="toggle toggle-primary bg-primary"
        onChange={toggleThemeWithAnimation}
        checked={isDarkMode}
      />
      {isMounted() && (
        <label htmlFor="theme-toggle" className={`swap swap-rotate ${!isDarkMode ? "swap-active" : ""}`}>
          <SunIcon className="swap-on h-5 w-5" />
          <MoonIcon className="swap-off h-5 w-5" />
        </label>
      )}
    </div>
  );
};

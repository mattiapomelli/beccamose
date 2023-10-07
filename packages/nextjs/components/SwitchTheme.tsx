import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";

export const SwitchTheme = ({ className }: { className?: string }) => {
  const { isDarkMode, toggle } = useDarkMode();

  useEffect(() => {
    const body = document.body;
    body.setAttribute("data-theme", isDarkMode ? "scaffoldEthDark" : "scaffoldEth");
  }, [isDarkMode]);

  return (
    <div className={`flex space-x-2 text-sm ${className}`}>
      <input
        id="theme-toggle"
        type="checkbox"
        className="toggle toggle-primary bg-primary"
        onChange={toggle}
        checked={isDarkMode}
      />
    </div>
  );
};

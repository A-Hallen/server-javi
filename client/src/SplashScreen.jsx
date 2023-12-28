import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoading = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    // window.addEventListener("load", handleLoading);
    // return () => window.removeEventListener("load", handleLoading);
    handleLoading();
  }, []);
  return !isLoading ? (
    <div className="splash-display-none">
      <div className="fade-in">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <p className="splash-name">Red Javi</p>
      </div>
    </div>
  ) : (
    <div className="splash">
      <div className="fade-in">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <p className="splash-name">Red Javi</p>
      </div>
    </div>
  );
}

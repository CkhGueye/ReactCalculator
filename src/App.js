import { useEffect, useState } from "react";
import Calculator from "./componants/Calculator";
import Footer from "./componants/Footer";
import Shape from "./componants/Shape";

export default function App() {
  const [color, setColor] = useState("");

  const bgColor = () => {
    const colors = ["#f48c8c", "#8f8cf4", "#f48cce", "#556"];
    let randomNum = Math.floor(Math.random() * 4);
    setColor(colors[randomNum]);
  };

  useEffect(() => {
    bgColor();
  }, []);

  return (
    <>
      <Shape color={color} />
      <div className="app">
        <Calculator bgColor={bgColor} />
        <Footer />
      </div>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { buttonData } from "./buttonData";
import * as math from "mathjs";

export default function Calculator({ bgColor }) {
  const inputScreen = useRef(null);
  const outputScreen = useRef(null);
  const [isReadyForReset, setIsReadyForReset] = useState(false);

  const [display, setDisplay] = useState("");
  const [firstDigit, setFirstDigit] = useState([]);
  const [lastDigit, setLastDigit] = useState([]);
  const [func, setFunc] = useState("");

  const evalFunc = (expression) => {
    return math.round(math.evaluate(expression), 4).toLocaleString("en-EN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    });
  };

  const equalsFunc = () => {
    let expression = firstDigit.join("") + func + lastDigit.join("");
    if (
      !lastDigit.length ||
      (lastDigit.length === 1 && lastDigit.indexOf("-") === 0)
    ) {
      expression = firstDigit.join("");
    }
    setDisplay(expression);
    const result = evalFunc(expression);
    setFirstDigit(result.split(""));
  };

  const clearFunc = () => {
    setFirstDigit([]);
    setLastDigit([]);
    setFunc("");
    setDisplay("");
    setIsReadyForReset(false);
    bgColor();
  };

  const handleClick = (e) => {
    const button = e.target;
    const isNumeric = !isNaN(button.value);

    //const regex=/^(?!.*(.)\1)[0-9\-]+$/;

    // add decimal sign and avoid more than one
    if (!isNumeric && button.value === ".") {
      let fz = firstDigit.length === 0 ? "0" : "";
      let lz = lastDigit.length === 0 ? "0" : "";
      if (!func && firstDigit.indexOf(button.value) === -1) {
        setFirstDigit([...firstDigit, fz, button.value]);
      } else if (func && lastDigit.indexOf(button.value) === -1) {
        setLastDigit([...lastDigit, lz, button.value]);
      }
      return false;
    }

    // add negative number
    if (!isNumeric && button.value === "-") {
      if (!func && firstDigit.length === 0) {
        setFirstDigit([button.value]);
      } else if (func && lastDigit.length === 0) {
        setLastDigit([button.value]);
      }
    }

    // clear button
    if (button.value === "ac") {
      clearFunc();
      return false;
    }

    // equals button
    if (button.value === "=") {
      firstDigit.length && equalsFunc();
      setIsReadyForReset(true);
      return false;
    }

    // remove minus sign on lastDigit when followed with an operator
    if (!isNumeric && lastDigit.length === 1 && lastDigit.indexOf("-") === 0) {
      setLastDigit([]);
      setFunc(button.value);
      return false;
    }

    // add an operator and avoid take the minus sign from firstDigit and lastDigit as un operator
    if (!isNumeric && firstDigit.length) {
      if (func && button.value === "-" && !lastDigit.length) return false;
      if (firstDigit.length === 1 && firstDigit.indexOf("-") === 0) {
        return false;
      }
      setFunc(button.value);
      setIsReadyForReset(false);
    }

    // add firstDigit and avoid it to start with zero
    if (isNumeric && !func) {
      if (button.value === "0" && firstDigit.length === 0) return false;
      setFirstDigit([...firstDigit, button.value]);
    }

    // add lastDigit and avoid it to start with zero
    if (isNumeric && func) {
      if (button.value === "0" && lastDigit.length === 0) return false;
      setLastDigit([...lastDigit, button.value]);
    }

    // pressing an operator after equals, start a new calculation with the result
    if (!isNumeric && display) {
      setDisplay("");
      setLastDigit([]);
      setFunc(button.value);
    }

    // add, subtract, multiply and divide a chain of numbers of any length
    // or start a new calculation if pressing a number after equals
    if (!isNumeric && firstDigit.length && lastDigit.length) {
      !isReadyForReset && setFirstDigit([...firstDigit, func, ...lastDigit]);
      setDisplay("");
      setLastDigit([]);
      setFunc(button.value);
      return false;
    } else if (
      isNumeric &&
      firstDigit.length &&
      lastDigit.length &&
      isReadyForReset
    ) {
      clearFunc();
      setFirstDigit([button.value]);
      setIsReadyForReset(false);
    }
  };

  useEffect(() => {
    const output = outputScreen.current;
    const input = inputScreen.current;
    output.innerText = firstDigit.length ? firstDigit.join("") : 0;
    if (func) {
      input.innerText = firstDigit.join("") + "" + func;
      if (lastDigit) {
        output.innerText = lastDigit.length
          ? lastDigit.join("")
          : evalFunc(firstDigit.join(""));
      }
    } else {
      input.innerText = "";
    }
    if (display) {
      input.innerText = display;
      output.innerText = firstDigit.join("");
    }
  }, [firstDigit, lastDigit, func, display]);

  const handleClicke = (e) => {
    const input = inputScreen.current;
    const output = outputScreen.current;
    const button = e.target;

    if (output.innerText.slice(0, 1) === "0" && output.innerText.length === 1) {
      output.innerText = output.innerText.replace("0", "");
    }

    output.innerText = output.innerText + "" + button.value;

    if (isNaN(button.value)) {
      if (
        isNaN(output.innerText.slice(0, 1)) &&
        output.innerText.slice(0, 1) !== "-"
      ) {
        output.innerText = "0";
      }

      if (
        isNaN(output.innerText.slice(-2, -1)) &&
        output.innerText.slice(-1) !== "-"
      ) {
        if (isNaN(output.innerText.slice(-2, -1))) {
          output.innerText = output.innerText.replace(
            output.innerText.slice(-2, -1),
            ""
          );
        }
        if (
          isNaN(output.innerText.slice(-1)) &&
          output.innerText.slice(-1) !== "-"
        ) {
          if (isNaN(output.innerText.slice(-2, -1))) {
            output.innerText = output.innerText.replace(
              output.innerText.slice(-2, -1),
              ""
            );
            console.log("si biir if");
          }
        }
      }
    }

    //console.log("last",output.innerText.slice(-1));

    if (button.id === "equals") {
      const result = output.innerText.replace("=", "").replaceAll(",", "");
      input.innerText = result;
      output.innerText = math
        .round(math.evaluate(result), 4)
        .toLocaleString("en-EN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        });
      setIsReadyForReset(true);
    }

    if (button.id === "clear") {
      input.innerText = "";
      output.innerText = 0;
    }

    if (!isNaN(button.value) && isReadyForReset) {
      input.innerText = "";
      output.innerText = button.value;
    } else if (button.id !== "equals") {
      setIsReadyForReset(false);
    }
  };

  return (
    <div id="calculator">
      <div id="screen">
        <span ref={inputScreen}></span>
        <span id="display" ref={outputScreen}>
          0
        </span>
      </div>
      <div className="block-btn">
        {buttonData.map((btn, key) => (
          <button
            key={key}
            id={btn.id}
            value={btn.value}
            onClick={(e) => handleClick(e)}
          >
            {btn.value}
          </button>
        ))}
      </div>
      <div className="line" />
    </div>
  );
}

import React from "react";
import More from "./more.svg";
import Minus from "./minus.svg";
import Del from "./del.svg";
import Check from "./check.svg";
import style from "./style.module.css";

const types = {
  more: More,
  minus: Minus,
  del: Del,
  check: Check,
};

const Ico = (props) => {
  return (
    <figure className={style.figure}>
      <img
        src={types[props.type]}
        className={`${style.ico} ${style[props.pointer]}`}
        alt={props.alt}
        onClick={props.onClick}
      />
    </figure>
  );
};

export default Ico;

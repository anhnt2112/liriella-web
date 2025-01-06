import React from "react";
import "./style.css";

const Input = ({ label = "", type = "text", value, onChange, readOnly = false }) => {
    return (
        <label className="input">
            <input className="input__field" type={type} placeholder=" " value={value} onChange={onChange} readOnly={readOnly} />
            <span className="input__label">{label}</span>
        </label>
    );
}

export default Input;
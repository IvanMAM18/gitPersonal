import { Input, Tooltip } from "antd";
import React from "react";
const formatNumber = (value) => new Intl.NumberFormat().format(value);
const NumericInput = (props) => {
    const { value, onChange } = props;
    const handleChange = (e) => {
        const { value: inputValue } = e.target;

        //const reg = /^-?\d*(\.\d*)?$/;
        const reg =
            props?.allowdecimals ?? true ? /^-?\d*(\.\d*)?$/ : /^-?\d*?$/;
        if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
            onChange(inputValue);
        }
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = () => {
        let valueTemp = value;
        if (value.charAt(value.length - 1) === "." || value === "-") {
            valueTemp = value.slice(0, -1);
        }
        onChange(valueTemp.replace(/0*(\d+)/, "$1"));
    };
    const title = value ? (
        <span className="numeric-input-title">
            {value !== "-"
                ? props?.formattooltip ?? true
                    ? formatNumber(Number(value))
                    : value
                : "-"}
        </span>
    ) : (
        props?.emptyMessage ?? "Input a number"
    );
    return (
        <Tooltip
            trigger={["focus"]}
            title={title}
            placement="topLeft"
            overlayClassName="numeric-input"
        >
            <Input
                {...props}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={props?.placeholder ?? ""}
                maxLength={16}
            />
        </Tooltip>
    );
};

export default NumericInput;

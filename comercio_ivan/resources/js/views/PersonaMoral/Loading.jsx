import { Spin } from "antd";
import React from "react";

export default function () {
    return (
        <div
            style={{
                height: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Spin size={"large"}></Spin>
        </div>
    );
}

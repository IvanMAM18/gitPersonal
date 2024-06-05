import React from "react";
import { Spin } from "antd";

export default function LoadingIndicator({ size = "small" }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
            }}
        >
            <Spin size={size} />
        </div>
    );
}

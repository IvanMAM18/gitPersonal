import { InboxOutlined } from "@ant-design/icons";
export default function DraggerBody({ identificador, cantidad, placeholder }) {
    return (
        <>
            <p style={{ width: "100%" }} className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p style={{ width: "100%" }} className="ant-upload-text">
                De click o arraste a esta área para cargar imagen
            </p>
            <p style={{ width: "100%" }} className="ant-upload-hint">
                {`Se puede subir hasta ${cantidad.length} imagenes`}
            </p>

            {/* <div style={{ display: "flex" }}>
                {cantidad.map((c) => (
                    <div
                        style={{ flex: 1, padding: 15, width: "50%" }}
                        key={Math.random()}
                    >
                        <img
                            id={`${identificador}-image-preview-${c}`}
                            src={placeholder}
                            alt="Image preview..."
                            style={{ width: "100%" }}
                        ></img>
                    </div>
                ))}<div
                    style={{ flex: 1, padding: 15, width: "50%" }}
                    key={Math.random()}
                >
                    <img
                        id="image-preview-0"
                        src="/imagenes/placeholder.jpg"
                        alt="Image preview..."
                        style={{ width: "100%" }}
                    ></img>
                </div>
                <div
                    style={{ flex: 1, padding: 15, width: "50%" }}
                    key={Math.random()}
                >
                    <img
                        id="image-preview-1"
                        src="/imagenes/placeholder.jpg"
                        alt="Image preview..."
                        style={{ width: "100%" }}
                    ></img>
                </div> 
                
            </div>*/}
        </>
    );
}

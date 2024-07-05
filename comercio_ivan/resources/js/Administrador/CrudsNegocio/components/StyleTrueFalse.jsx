import { Tag } from "antd";

export default function StyleTrueFalse({condicion}) {
    return(
        condicion
            ? <Tag style={{backgroundColor: '#16a34a', color: '#bbf7d0', border: 'transparent', marginLeft: '42%'}}>SI</Tag>  
            : <Tag style={{backgroundColor: '#b91c1c', color: '#fecaca', border: 'transparent', marginLeft: '38%'}}>NO</Tag>
    );
}
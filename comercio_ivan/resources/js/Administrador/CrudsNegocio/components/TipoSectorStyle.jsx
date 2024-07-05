import { Tag } from "antd";

export default function TipoSectorStyle({sector}) {
    return(
        (sector === 'INDUSTRIA') ? <Tag style={{backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe'}}>{sector}</Tag>  
            : (sector === 'SERVICIOS') ? <Tag style={{backgroundColor: '#ffedd5', color: '#c2410c', border: '1px solid #fdba74'}}>{sector}</Tag> 
            : <Tag style={{backgroundColor: '#fefce8', color: '#ca8a04', border: '1px solid #fde047'}}>{sector}</Tag>
    );
}
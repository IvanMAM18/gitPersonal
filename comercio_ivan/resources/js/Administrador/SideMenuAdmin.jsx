import { Menu, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { authorize} from "@/v2/utils/App";

const currentPath = window.location.pathname.replace('/app/admin-cruds', '')

export default function SideMenuAdmin() {

    const navigate = useNavigate();

    // Link de menu
    const menuLinks = [
        {
            authorized: true,
            key: 'dashboard',
            label: 'Dashboard',
            path: '',
        },
        {
            authorized: authorize('index:catalogo-tramites'),
            key: 'catalogo-tramites',
            label: 'Catálogo Trámites',
            path: '/catalogo-tramites',
        },
        {
            authorized: authorize('index:catalogo-giros-comerciales'),
            key: 'catalogo-giros-comerciales',
            label: 'Catálogo Giros Comerciales',
            path: '/catalogo-giros-comerciales',
        },
        {
            authorized: authorize('index:condicionantes'),
            key: 'condicionantes',
            label: 'Catálogo Condicionantes',
            path: '/condicionantes'
        },
        {
            authorized: authorize('index:catalogo-requisitos'),
            key: 'requisitos',
            label: 'Catálogo Requisitos',
            path: '/requisitos'
        },
        {
            authorized: authorize('index:catalogo-subtramites'),
            key: 'subtramites',
            label: 'Subtrámites',
            path: '/subtramites'
        },
        {
            key: 'trabajadores',
            authorized: authorize('index:trabajadores'),
            label: 'Trabajadores',
            path: '/trabajadores'
        },
        {
            authorized: authorize('index:usuarios'),
            key: 'usuarios',
            icon: '',
            label: 'Usuarios',
            path: '/usuarios'
        },
        {
            authorized: authorize(['index:roles', 'index:permisos']),
            key: 'autorizaciones',
            icon: '',
            label: 'Autorizaciones',
            path: '/autorizaciones'
        },
        {
            authorized: authorize('index:conceptos'),
            key: 'conceptos',
            label: 'Conceptos',
            path: '/conceptos'
        },
        {
            authorized: authorize('index:umas'),
            key: 'umas',
            label: 'UMAS',
            path: '/umas'
        }
    ]
        // Filtrar las rutas autorizadas para el usuario
        .filter(route => route.authorized)
        // Quitamos la propiedad authorized del array, por un warning que sale con el componente de antd.
        .map(route => {
            return {
                key: route.key,
                label: route.label,
                path: route.path
            }
        })

    // Busca el item del menu que concidan en el path de la url para selecionarlo como default al inciiar.
    const selectedKey = menuLinks.find(menu => menu.path === currentPath).key

    // Cuando se hace click en algun elemento del menu
    const onClick = (event) => navigate(event.item.props.path)

    const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content

    return (
        <>

            {/*Encabezado*/}
            <Row className="flex items-center justify-center py-3 px-3 border-b">
                <a className="w-36" href="/">
                    <img src="/imagenes/ESCUDO_color.png" alt="H.XVII Ayuntamiento de La Paz"/>
                </a>
                <div className="font-mediums hidden md:block text-center ">
                    H.XVII Ayuntamiento<br/> de La Paz
                </div>
            </Row>

            {/* Menu Items */}
            <Menu mode="inline" defaultSelectedKeys={selectedKey}  onClick={onClick} items={menuLinks}/>

            {/*Boton para cerrar sesion*/}
            <div className="px-4">
                <form action="/logout" method="post">
                    <input type="hidden" name="_token" value={csrfToken}/>
                    <button type="submit" className="uppercase text-[14.5px] hover:text-app flex w-100 justify-center md:justify-start text-center mt-2 items-center gap-2">
                        <LogoutOutlined/>
                        <span className="hidden md:block">Cerrar Sesión</span>
                    </button>
                </form>
            </div>
        </>
    );
}

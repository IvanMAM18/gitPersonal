import { Menu, Row, Col } from "antd";
import { Link } from "react-router-dom";
import {
    HomeFilled,
    ExportOutlined,
    DatabaseFilled,
    FileAddFilled,
    UserAddOutlined,
} from "@ant-design/icons";

import axios from "axios";

export default function SideMenuAdmin() {
    const adminMenuItems = [
        [
            <HomeFilled key={Math.random()} />,
            <span key={Math.random()}>Dashboard</span>,
            <Link key={Math.random()} to={"/"} />,
        ],
        [
            <DatabaseFilled key={Math.random()} />,
            <span key={Math.random()}>Catálogo Trámites</span>,
            <Link to={"/catalogo-tramites"} key={Math.random()} />,
        ],
        [
            <DatabaseFilled key={Math.random()} />,
            <span key={Math.random()}>Catálogo Giros Comerciales</span>,
            <Link to={"/catalogo-giros-comerciales"} key={Math.random()} />,
        ],
        [
            <DatabaseFilled key={Math.random()} />,
            <span key={Math.random()}>Catálogo Condicionantes</span>,
            <Link to={"/condicionantes"} key={Math.random()} />,
        ],
        [
            <DatabaseFilled key={Math.random()} />,
            <span key={Math.random()}>Catálogo Requisitos</span>,
            <Link to={"/requisitos"} key={Math.random()} />,
        ],
        [
            <FileAddFilled key={Math.random()} />,
            <span key={Math.random()}>Subtrámites</span>,
            <Link to={"/subtramites"} key={Math.random()} />,
        ],
        [
            <FileAddFilled key={Math.random()} />,
            <span key={Math.random()}>Trabajadores</span>,
            <Link to={"/trabajadores"} key={Math.random()} />,
        ],
        [
            <UserAddOutlined key={Math.random()} />,
            <span key={Math.random()}>Usuarios</span>,
            <Link to={"/usuarios"} key={Math.random()} />,
        ],
        [
            <UserAddOutlined key={Math.random()} />,
            <span key={Math.random()}>Conceptos</span>,
            <Link to={"/conceptos"} key={Math.random()} />,
        ],
        [
            <DatabaseFilled key={Math.random()} />,
            <span key={Math.random()}>UMAS</span>,
            <Link to={"/umas"} key={Math.random()} />,
        ],
    ];
    return (
        <>
            <Row className="logo-ayuntamiento py-3 px-3">
                <Col className="gutter-row" xs={24}>
                    <a className="navbar-brand" href={"/"}>
                        <img
                            className="image-escudo"
                            src="/imagenes/ESCUDO_color.png"
                            alt="Ayuntamiento"
                        />
                    </a>
                </Col>
                <Col className="gutter-row text-logo-ayuntamiento" xs={24}>
                    <span>H.XVII Ayuntamiento de La Paz</span>
                </Col>
            </Row>
            <Menu defaultSelectedKeys={0} mode="inline" theme="light">
                {adminMenuItems.map((item, index) => {
                    return (
                        <Menu.Item eventkey={index} warnkey={index} key={index}>
                            {item}
                        </Menu.Item>
                    );
                })}
                <Menu.Item eventkey="99" warnkey="99" key="99">
                    <ExportOutlined />
                    <span>Cerrar sesión</span>
                    <Link
                        to="#"
                        onClick={async () => {
                            const response = await axios.post("/logout");
                            if (response.status === 200) {
                                location.href = "/login";
                            }
                        }}
                    />
                </Menu.Item>
            </Menu>
        </>
    );
}

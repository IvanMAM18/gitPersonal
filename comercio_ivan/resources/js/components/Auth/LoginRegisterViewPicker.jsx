import { Button } from "antd";

export default function LoginRegisterViewPicker({mode}) {

    return (
        <>
            <div className="mt-4">
                <small>
                    {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
                </small>
            </div>

            {mode === "register" && (
                    <a className={'ant-btn ant-btn-link'} href={'/login'}>Inicia sesión</a>
            )}
            {mode === "login" && (
                <a className={'ant-btn ant-btn-link'} href={'/register'}>Regístrate</a>
            )}

            <div>
                <div className="mt-2"></div>
                <small>¿Olvidaste tu contraseña?</small>
            </div>
            <Button type="link" href="/password/reset">
                Recuperar contraseña
            </Button>
        </>
    );
}

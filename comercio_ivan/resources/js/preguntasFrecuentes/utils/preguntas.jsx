export const preguntasFrecuentes = [
    {
        title:"accesoCuenta",
        subtitle:'Acceso a la Cuenta',
        description:'Consulta las preguntas frecuentes sobre cómo acceder y gestionar tu cuenta.',
        preguntas:[
            {
                title: '¿Cómo crear una cuenta?', 
                content: `
                    Ingresa a la página de <a href="https://tramites.lapaz.gob.mx/register">registro de usuarios para el Portal de Trámites y Servicios en Línea</a>, selecciona la opción “REGÍSTRATE”, al ingresar va a necesitar:
                    <ul style="padding-left:4%">
                        <li>- Nombre completo</li>
                        <li>- RFC</li>
                        <li>- Curp</li>
                        <li>- Correo electrónico.</li>
                        <li>- Contraseña para el portal de Trámites y servicios.</li>
                        <li>- Aceptar los términos y condiciones.</li>
                    </ul>
                    Una vez registrado, le llegará una notificación de confirmación a su correo registrado. (Si se trata de persona moral, capture los datos del representante legal).
                    Una vez creado su registro, podrá iniciar sesión en el Portal de Trámites y Servicios.
                    ` 
            },
            {
                title: '¿Cómo cambiar el correo electrónico?', 
                    content: `
                    En caso de no tener acceso al correo registrado, deberá solicitar el cambio en la <strong>ventanilla de la Dirección de Comercio del 
                    H. Ayuntamiento de La Paz</strong> o mediante una solicitud de cambio 
                    de correo electrónico a la siguiente dirección: <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> donde deberá anexar:
                    <ul style="padding-left:4%">
                    <li>- Identificación del propietario o representante legal.</li>
                    <li>- ID del trámite.</li>
                    <li>- Nombre.</li>
                    <li>- CURP</li>
                    <li>- RFC</li>
                    <li>- Correo electrónico nuevo.</li>
                    <li>- Documento de propiedad o acta que lo acredite.</li>
                    </ul>
                    `
            },
            { 
                title: '¿Cómo cambiar la contraseña de mi usuario registrado?', 
                content: `
                En caso de no tener acceso al portal de Trámites y Servicios en Línea:
                <ol>
                  <li>- Ingresar al <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
                  <li>- Ingresar en la opción de recuperar contraseña.</li>
                  <li>- Ingresar el correo registrado.</li>
                  <li>- Solicita el enlace para restablecer la contraseña.</li>
                  <li>- Al correo registrado, le llegará un enlace para ingresar su nueva contraseña.</li>
                </ol>
        
                En caso de poder iniciar sesión dentro del portal de trámites y servicios en línea, podrá observar la opción: “Actualizar Datos” donde podrá actualizar su contraseña.
                ` 
            },
            { 
                title: '¿Cómo recuperar una cuenta si no tengo acceso al correo?', 
                content: `
                En caso de no tener acceso al correo registrado, podrá solicitar el cambio de correo en la <strong>ventanilla de la Dirección de Comercio del 
                H. Ayuntamiento de La Paz</strong> o mediante una solicitud a la siguiente dirección: <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> en donde deberá anexar:
                <ul style="padding-left:4%">
                  <li>- Identificación del propietario</li>
                  <li>- ID del trámite.</li>
                  <li>- Correo nuevo.</li>
                  <li>- Documento de propiedad o acta que lo acredite.</li>
                </ul>
                ` 
            },
            { 
                title: '¿Qué hago si me dice que mi RFC o CURP ya está en uso?', 
                content: `
                Si usted ha realizado un trámite en la dirección de comercio, inicie sesión con su correo y contraseña, en caso de no recordarla, vaya al apartado de OLVIDÉ MI CONTRASEÑA y siga las instrucciones.
                <br><br>
                Si un gestor manejaba sus trámites, este creó una cuenta con su RFC y/o CURP para poder administrar sus 
                trámites dentro de la Dirección de Comercio por el H. Ayuntamiento de La Paz, si ya no va a llevar a cabo 
                sus trámites con un gestor, es necesario que el contribuyente solicite al correo <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> el 
                cambio de correo, agregando el nuevo correo y el nombre, CURP, RFC e INE del propietario. Si va a seguir 
                administrando su trámite con su gestor, es necesario que le pida a éste su correo y contraseña.
                <br><br>
                Si no ha realizado trámites, favor de acudir a <strong>ventanilla de la Dirección de Comercio del 
                H. Ayuntamiento de La Paz</strong> o mandar correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> solicitando más información al respecto.
                ` 
            },
            { 
                title: '¿Qué hago si no puedo acceder a mi cuenta porque la manejaba un gestor?', 
                content: `
                El contribuyente tiene que solicitar al correo <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a>
                 el cambio de correo, agregando el ID del trámite, el nuevo correo y el nombre, CURP, RFC, e INE del propietario y/o representante legal.
                ` 
            },
            { 
                title: 'No he recibido el correo de verificación', 
                content: `
                <ol>
                  <li>- Ingresa a <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
                  <li>- Intenta iniciar sesión con el correo electrónico y contraseña asociada al registro.</li>
                  <li>- Si no puede iniciar sesión, solicitará de nueva cuenta un enlace para la verificación de correo.</li>
                  <li>- En la bandeja de entrada de su correo personal o el correo registrado, aparecerá la siguiente ventana con el mensaje "Se detectó que aún no confirmas tu correo electrónico".</li>
                  <li>- Da clic en "Vuelve a mandar la notificación" que se encuentra al final del mensaje.</li>
                  <li>- Revisa tu bandeja de entrada de correo electrónico y/o revisa el apartado de "spam" y da click en el botón "Verifica tu correo electrónico".</li>
                </ol>
                ` 
            },
            { 
                title: '¿Tienes problemas de carga o acceso a la página?', 
                content: `
                <ul style="padding-left:4%">
                  <li>- Verifica que tu conexión a una red WiFi cuente con señal estable o con un servicio de datos móviles activado.</li>
                  <li>- Borra el historial o caché/cookies de tu dispositivo móvil u ordenador e ingresa al <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
                </ul>
                ` 
            }
        ]
    },
    {
        title:"sobreLicencias",
        subtitle:'Sobre las Licencias',
        description:'Encuentra infromación sobre los trámites y requisitos de licencias.',
        preguntas: [
            {
                title: '¿Qué requisitos/documentos se requieren para realizar el trámite en línea de mi licencia de funcionamiento?',
                content: `<p style="font-weight: bold;">Necesitas entregar los siguientes documentos:</p>
                    <ul style="padding-left:4%;">
                        <li>- Identificación oficial por ambos lados.</li>
                        <li>- Constancia de situación fiscal.</li>
                        <li>- Foto de la fachada del negocio</li>
                        <li>- Comprobante de uso de suelo emitido por el H. Ayuntamiento de La Paz.</li>
                        <li>- Licencia de uso de edificación.</li>
                        <li>- Copia de credencial de elector del solicitante en caso de ser persona física, o acta constitutiva, para personas morales.</li>
                        <li>- Constancia de no retardo en pago del impuesto predial.</li>
                        <li>- Constancia sanitaria.</li>
                        <li>- Título de propiedad, contrato de arrendamiento u otro instrumento jurídico que acredite el derecho real que tiene sobre el inmueble.</li>
                        <li>- Acreditar que el inmueble donde se está solicitando la autorización de licencia no guarde adeudos generados por cualquier contribución municipal.</li>
                        <li>- Acreditar personalidad.</li>
                        <li>- Dictamen de factibilidad de operación emitido por la Dirección Municipal de Protección Civil que conste que el establecimiento cumple con las condiciones necesarias para operar con el giro solicitado.</li>
                        <li>- Ser independiente de casa-habitación (excepto restaurantes, cafés, fondas y cenadurías).</li>
                        <li>- El establecimiento debe encontrarse en condiciones materiales adecuadas para brindar el servicio con el giro solicitado.</li>
                        <li>- Carta de no antecedentes penales.</li>
                        <li>- Constancia que acredite al alta en la Secretaría de Hacienda y Crédito Público.</li>
                        <li>- Contar con la anuencia vecinal para la apertura del negocio.</li>
                        <li>- Contar previamente con la construcción de Rampa para Discapapcitados para el acceso al local.</li>
                    </ul>`
            },
            {
                title: '¿Cuál es el proceso para realizar una apertura de licencia de funcionamiento?',
                content: `
                <ol>
                    <li style="font-weight: bold;">Ingresa al <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
                    <li style="font-weight: bold;">Registrarse como usuario del portal de trámites y servicios:</li>
                    <li style="font-weight: bold;">En el campo de Expediente Digital, añadir la documentación que se solicita.</li>
                    <ul style="padding-left:4%">
                        <li>- Identificación por ambos lados.</li>
                        <li>- Comprobante de domicilio de SAPA (Propietario).</li>
                        <li>- Constancia de Situación Fiscal (Opcional).</li>
                        <li>- Pasaporte (Opcional).</li>
                        <li>- Acta constitutiva (En caso de persona moral).</li>
                    </ul>
                    <li style="font-weight: bold;">Seleccionar la opción de trámites disponibles.</li>
                    <li style="font-weight: bold;">Seleccionar la opción de "Iniciar Trámite" de licencia de funcionamiento.</li>
                    <li style="font-weight: bold;">Completar la información del establecimiento:</li>
                    <ul style="padding-left:4%">
                        <li>- Nombre comercial del establecimiento.</li>
                        <li>- Teléfono del establecimiento.</li>
                        <li>- Giros comerciales.</li>
                        <li>- Descripción de la actividad.</li>
                        <li>- Fecha de inicio de operaciones.</li>
                        <li>- Cámara de comercio.</li>
                        <li>- Seleccionar si tendrá venta de alcohol.</li>
                        <li>- Comprobante de domicilio del establecimiento de SAPA.</li>
                        <li>- Foto frontal del establecimiento.</li>
                        <li>- Seleccionar horarios de operación.</li>
                        <li>- Dirección del establecimiento.</li>
                        <li>- Seleccionar a quién le pertenece el predio y cargar el documento jurídico que acredite la propiedad.</li>
                    </ul>
                    <li style="font-weight: bold;">Completar la información del predio.</li>
                    <ul style="padding-left:4%">
                        <li>- Seleccionar tipo de predio.</li>
                        <li>- Escribir la clave catastral o folio y verificar que no tenga adeudos.</li>
                        <li>- Seleccionar el periodo de recolección de desechos y el volumen de generación.</li>
                        <li>- Seleccionar en el mapa la ubicación exacta del establecimiento.</li>
                        <li>- Ingresar la superficie construida del establecimiento.</li>
                        <li>- Seleccionar los cajones del establecimiento.</li>
                        <li>- Seleccionar el tipo de negocio.</li>
                        <li>- Si cuenta con anuncio publicitario, completar las características solicitadas.</li>
                        <li>- Seleccionar el tamaño de la empresa.</li>
                        <li>- Llenar los campos estadísticos y seleccionará  si cuenta con personas con capacidades diferentes.</li>
                    </ul>
                    <li style="font-weight: bold;">Si va a facturar, seleccionar el régimen fiscal e ingresar la dirección del establecimiento.</li>
                    <li style="font-weight: bold;">Enviar la  solicitud de registro del establecimiento.</li>
                </ol>
                `
            },
            {
                title: '¿Cuál es el proceso para realizar el refrendo de una licencia?',
                content: `Acudir a tesorería con la licencia original y último refrendo, en su caso, denuncia de robo ante las autoridades competentes, o la manifestación bajo protesta de decir verdad, pasada ante la fé notarial del extravío de solicitud. Posteriormente, solicitar el refrendo de la licencia y paga.`
            },
            {
                title: '¿Cómo se realiza el refrendo de alcohol?',
                content: `Acudir a <strong>Tesorería del H. Ayuntamiento de La Paz</strong> con la licencia de funcionamiento pagada y activa  y solicitar el refrendo de licencia de alcohol.`
            },
            {
                title: '¿Cómo vincular la licencia de alcohol a la licencia de funcionamiento?',
                content: `Se registra primero la licencia de funcionamiento y se selecciona que se requiere licencia de alcohol, de esta forma será posible entrar al consejo.`
            },
            {
                title: '¿Qué requisitos necesito para agregar la persona moral en mi trámite de licencia de funcionamiento?',
                content: `<p style="font-weight: bold;">Necesita entregar la siguiente documentación:</p>
                <ul style="padding-left:4%">
                    <li>- Razón social.</li>
                    <li>- Régimen fiscal.</li>
                    <li>- Régimen cpaital.</li>
                    <li>- RFC.</li>
                    <li>- Acta Constitutiva o Poder Notarial.</li>
                    <li>- Direeción geográfica: Calles, número exterior, número interior, código postal y colonia.</li>
                    <li>- Seleccionar la ubicación en el mapa.</li>
                    <li>- Ingresar la dirección de notificación.</li>
                </ul>`
            },
            {
                title: '¿Se debe de subsanar la licencia 2023 para poder obtener la licencia 2024?',
                content: `Si es un negocio que existe anterior al 2024, es necesario subsanar la licencia de
                funcionamiento 2023. De caso contrario, con la licencia de funcionamiento 2024 es
                suficiente.`
            },
            {
                title: 'No puedo generar trámite, me marca adeudo de predial.',
                content: `Para poder realizar los trámites es necesario <strong>no tener adeudos</strong> con el H. Ayuntamiento de La Paz.`
            },
            {
                title: '¿Me pueden revocar la licencia de funcionamiento?',
                content: `Si, las licencias están condicionadas al cumplimiento de todos los requisitos impuestos por las distintas direcciones del H. Ayuntamiento de La Paz, en caso de no cumplir con uno o más, la licencia de funcionamiento será revocada y se tendrá que iniciar el trámite nuevamente.`
            },
            {
                title: 'Soy un negocio semifijo, ¿tengo que sacar mi licencia de funcionamiento?',
                content: `Primero es necesario acudir a <strong>Movilidad y Espacio Público</strong> ubicado en la segunda planta del <strong>H. Ayuntamiento de La Paz</strong>, en donde ellos determinarán si el negocio necesita licencia de funcionamiento.`
            },
            {
                title: 'Soy un mercado municipal, ¿debo tramitar mi licencia de funcionamiento?',
                content: `Si, debido a que la recolección de basura de los negocios internos del mercado queda a responsabilidad del Mercado Municipal en el que estén situados.`
            },
            {
                title: '¿Cómo puedo obtener la licencia de funcionamiento de un comercio si estoy arrendando el establecimiento?',
                content: `Es necesario presentar el contrato de arrendamiento para poder obtener la licencia de funcionamiento.`
            },
            {
                title: '¿Cuál es la diferencia entre una licencia de funcionamiento PRO SARE y una regular?',
                content: `La licencia de funcionamiento SARE corresponde al principal trámite para abrir empresas de bajo riesgo. Mientras que las regulares son para empresas de Mediano y Alto impacto.`
            },
            {
                title: '¿En cuánto tiempo estará listo el trámite de mi licencia de funcionamiento?',
                content: `<strong>Para Micro-Pequeña- mediana o grande empresa de bajo riesgo.<br></strong>
                Se crea el SARE, como un mecanismo que integra y consolida todos los trámites municipales para abrir una micro, pequeña, mediana o grande empresa que realice  actividades de bajo riesgo para la salud, seguridad y el medio ambiente garantizando el inicio de operaciones en un máximo de tres días hábiles, a partir del ingreso de la solicitud debidamente integrada.
                <br>
                <strong><br>Para Micro-Pequeña- mediana o grande empresa de mediano/alto riesgo.<br></strong>
                Para abrir una micro, pequeña, mediana o grande empresa que realice  actividades de mediano o alto riesgo para la salud, seguridad y el medio ambiente garantizando el inicio de operaciones en un máximo de 10 días hábiles, a partir del ingreso de la solicitud debidamente integrada.`
            }
        ]
    },
    {
        title:"comercio",
        subtitle:'Comercio',
        description:'Resuelve tus dudas sobre aspectos comerciales y normativas.',
        preguntas: [
            {
                title: '¿Cómo se agrega una persona moral?',
                content: `Si se realizó el trámite como persona física, pero realmente es una persona moral, 
                en la plataforma <a href="https://tramites.lapaz.gob.mx/">Portal de Trámites y Servicios en Línea</a>, dentro de su cuenta, hay un apartado 
                llamado Persona Moral,  en donde puede agregar los datos de la persona moral en 
                cuestión. Posterior a esto, hay que solicitar en <strong>ventanilla de la Dirección de Comercio del 
                H. Ayuntamiento de La Paz</strong> o por correo a 
                <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> que se vincule la persona moral al ID del trámite. Los 
                avisos de pago que tenía en plataforma se eliminarán y se le generarán nuevos 
                para que pueda facturar como persona moral.`
            },
            {
                title: '¿Cómo cambiar el nombre comercial?',
                content: `Hay que solicitar en <strong>ventanilla de la Dirección de Comercio del 
                H. Ayuntamiento de La Paz</strong> o por correo a 
                <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> que se 
                haga el cambio de nombre comercial, anexando el nombre actual, el ID del negocio, 
                el nombre al que se quiere cambiar y una copia de una identificación oficial del 
                propietario del comercio.`
            },
            {
                title: '¿Cómo agregar giros comerciales?',
                content: `Hay que solicitar en <strong>ventanilla de la Dirección de Comercio del 
                H. Ayuntamiento de La Paz</strong> o por correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> que se 
                agreguen los giros comerciales, así como el listado de los requeridos. En caso de 
                que alguno de los giros comerciales anexados sea de alto impacto y previamente el 
                contribuyente haya estado como bajo impacto, deberá subsanar la actualización de cobros 
                de esa cuota.`
            },
            {
                title: '¿Cómo sé el impacto de un establecimiento?',
                content: `El giro comercial es el que determina el impacto de una empresa, si el 
                establecimiento tiene diversos giros, se va a tomar como impacto de la empresa el 
                giro con mayor impacto.`
            },
            {
                title: '¿Cómo sé el tamaño de mi empresa?',
                content: `<p style="font-weight: bold;">El tamaño de una empresa se determina por el número de empleados que tiene:</p>
                <ul style="padding-left:4%">
                    <li>- Micro: 1-10 empleados.</li>
                    <li>- Pequeña: 11-30 empleados.</li>
                    <li>- Mediana: 31-100 empleados.</li>
                    <li>- Grande: Más de 100 empleados.</li>
                </ul>`
            },
            {
                title: '¿Cómo cambio el representante legal de un negocio?',
                content: `El nuevo representante legal debe crear una cuenta nueva en el 
                <a href="https://tramites.lapaz.gob.mx/register">Portal de Trámites y Servicios en Línea</a> con su nombre, CURP y RFC, así como enviar por 
                correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> la solicitud de traslado de ID del trámite a la 
                cuenta nueva, así como adjuntar el nuevo poder y la INE, para poder ser validado.`
            },
            {
                title: '¿Cómo cambio el propietario del comercio?',
                content: `El nuevo propietario legal debe crear una cuenta nueva en el
                <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a>  con su nombre, CURP y RFC, así como enviar por 
                correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> la solicitud de traslado de ID del trámite a la 
                cuenta nueva, así como la INE del nuevo propietario y del propietario anterior, así 
                como un permiso escrito y firmado por el propietario anterior.`
            },
            {
                title: '¿Qué hago si me equivoqué al elegir el tamaño de la empresa?',
                content: `<strong>Si aún no tiene pagos realizados que le afecten y quiere bajar o subir el tamaño de 
                la empresa</strong>, se requiere la liberación de tamaño de empresa a la Dirección de 
                Gobierno Digital del H. Ayuntamiento de La Paz, para que el contribuyente vuelva a 
                elegirlo desde su cuenta.
        
                <strong><br><br>Si el contribuyente ya realizó pagos de servicios públicos, ecología y/o protección 
                civil en tamaño de empresa menor y requiere subir el tamaño</strong>, se pide a la 
                Dirección de Gobierno Digital del H. Ayuntamiento de La Paz la liberación del 
                tamaño de empresa y se cancelan los avisos, por lo que queda saldo a favor de lo 
                pagado y se pide que se le generen los avisos de pago correctos, para que ahí se 
                aplique el saldo a favor y se pague lo restante. 
        
                <strong><br><br>Si el contribuyente ya realizó pagos de servicios públicos, ecología y/o protección 
                civil en tamaño de empresa mayor y se requiere bajar el tamaño</strong>, se solicita 
                mediante oficio dirigido a la Dirección de Comercio del H. Ayuntamiento de La Paz 
                que se modifique el tamaño de la empresa, argumentando cuál es el tamaño 
                correcto, después se inspecciona el comercio y ya que se recibe el reporte de la 
                inspección y da un resultado congruente, la Dirección de Comercio realiza el 
                cambio de tamaño de la empresa, se cancelan los avisos de pago, dejando a favor 
                de lo pagado y se solicita que se le generen los avisos correctos, para que ahí se le 
                aplique el saldo a favor.`
            },
            {
                title: '¿Qué hago si mi trámite 2023 tuvo errores y no avanzó?',
                content: `Si el error está en la foto de comercio, comprobante de domicilio y(o 
                documento de propiedad, se debe solicitar al correo <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> 
                que se habilite el campo para volver a subir el documento correcto, así el 
                contribuyente, posterior a esto, podrá ingresar y subsanar el documento.
        
                Si el error está en la clave catastral, no hay manera de modificarlo, por lo que se 
                debe solicitar la eliminación del ID del trámite por oficio, sustentando la petición y 
                volviendo a realizar el trámite en su cuenta con la clave catastral correcta, como 
                una apertura en el año fiscal.`
            },
            {
                title: '¿Cómo hacer la modificación de metros cuadrados?',
                content: `Se requiere redactar un oficio dirigido a la <strong>Dirección de Comercio del H. 
                Ayuntamiento de La Paz</strong> solicitando la habilitación de la modificación de metros 
                cuadrados de un establecimiento, posteriormente recibirá notificación de que el 
                apartado ya puede ser alterable para que realice las modificaciones correspondientes.`
            },
            {
                title: '¿Qué es un ID?',
                content: `<strong>Identificador único</strong> para cada orden que usted ha iniciado en nuestra plataforma de 
                Trámites y Servicios.`
            },
            {
                title: '¿Cuál es el ID de mi trámite?',
                content: `Al iniciar sesión con su cuenta dentro del <a href="https://tramites.lapaz.gob.mx/login">
                Portal de Trámites y Servicios en Línea</a>, en 
                la opción de TRÁMITES, y MIS TRÁMITES ACTIVOS, podrá identificar el ID de su 
                trámite, el trámite que está realizando, nombre y el estatus de su trámite por cada 
                entidad.`
            },
            {
                title: '¿Cuál es el ID del negocio?',
                content: `El ID del negocio es el <strong>identificador único</strong> que tiene el establecimiento comercial, 
                ayuda a obtener el listado de trámites que ha realizado el contribuyente de ese 
                negocio en la Dirección de Comercio del H. Ayuntamiento de La Paz`
            },
            {
                title: '¿Cómo elimino un ID?',
                content: `Se tiene que hacer la petición mediante un oficio dirigido a la <strong>Dirección de Comercio 
                del H. Ayuntamiento de La Paz</strong>, sustentando la razón por la cual hace la solicitud. `
            },
            {
                title: '¿Cuál es la diferencia entre el ID de mi trámite y el  ID de mi negocio?',
                content: `El ID del trámite corresponde al procedimiento que se está realizando, mientras que 
                el ID del negocio es de un establecimiento. En el caso del seguimiento de trámites, 
                es necesario proporcionar el ID del trámite.`
            },
            {
                title: '¿Cuándo debo de ingresar la clave catastral y cuando el folio?',
                content: `Dependiendo del tipo de asentamiento es lo que vas a registrar. Para la Zona 
                Rústica tienes que poner el folio, mientras que para la Zona Urbana debes poner la 
                clave catastral. `
            },
            {
                title: '¿Qué es la clave catastral?',
                content: `Código de identificación único que se asigna a cada inmueble dentro del municipio 
                de La Paz. Esta clave sirve para identificar de manera precisa y única a cada predio 
                o parcela dentro de un registro oficial, es asignado conforme al catálogo de 
                regiones que defina la propia entidad.
                <br><br>
                <strong>Ejemplo clave catastral:</strong> 602-017-004-804`
            },
            {
                title: '¿Qué es el folio de predio?',
                content: `Código de identificación único oficial que acredita que el inmueble se encuentra 
                registrado en el padrón catastral y de impuesto predial a favor del propietario.
                <br><br>
                <strong>Ejemplo folio de predio:</strong> 115074`
            },
            {
                title: '¿En donde veo los datos de mi inmueble para el registro de una Licencia de Funcionamiento?',
                content: `Si no conoce la clave catastral o el folio del predio acuda a la <strong>Ventanilla de la 
                Dirección de Catastro del H. Ayuntamiento de La Paz</strong> y con el nombre completo del 
                dueño se busca en archivo, en caso de que la persona cuente con más de una 
                propiedad, se solicita la dirección del predio.`
            }
        ]
    },
    {
        title:"usoSueldo",
        subtitle:'Uso de Suelo',
        description:'Resuelve las dudas frecuentes sobre imagen urbana y los usos de suelo.',
        preguntas: [
            {
                title: '¿Cómo puedo obtener el uso de suelo si soy arrendatario del local comercial?',
                content: `En vez de solicitar la escritura se pide el contrato de arrendamiento con copia de la 
                identificación oficial del arrendador y el arrendatario y que el predial y escritura 
                coincida con el contrato. Además es necesario que el pago del predial esté al 
                corriente y que la clave catastral coincida con la establecida en el contrato de arrendamiento.`
            },
            {
                title: '¿Qué es el Reglamento de Imagen Urbana?',
                content: `Es la normativa encargada de ordenar y regular la imagen urbana de las zonas 
                centro y áreas patrimoniales de las poblaciones en el municipio de La Paz. Puedes 
                consultarlo en el <a href="https://lapaz.gob.mx/images/marco-normativo/Reglamento-de-Imagen-Urbana-del-Municipio-de-La-Paz-BCS_BOGE-Num25_10-07-2017.pdf">
                Reglamento de Imagen Urbana del Municipio de La Paz.</a>`
            },
            {
                title: '¿Por qué me sale que el uso de suelo está autorizado sujeto a revisión técnica?',
                content: `Acorde al Artículo 123 la Ley de Hacienda para el Municipio de La Paz, todas las 
                licencias comerciales <strong>mayores a 500 metros de construcción</strong> en los usos 
                comerciales queda sujeta a revisión técnica.`
            },
            {
                title: '¿Debo solicitar permiso para la colocación de anuncios?',
                content: `De acuerdo a los Artículos 6 y 8 del Reglamento de Anuncios para el Municipio de 
                La Paz, Baja California Sur, es necesario solicitar permiso para la colocación de 
                anuncios en la fachada de su establecimiento.`
            }
        ]
    },
    {
        title:"medioAmbiente",
        subtitle:'Medio Ambiente',
        description:'Infromate sobre las vistas de la Dirección de Medio Ambiente y COEPRIS.',
        preguntas:[
            {
                title: '¿Por qué me solicitan trampa de grasa y la recolección de aceite?',
                content: `De acuerdo al Artículo 77 de Reglamento de Preservación, Equilibrio Ecológico y 
                Protección al Medio Ambiente para el Municipio de La Paz, los propietarios de 
                restaurantes o establecimientos comerciales de venta de alimentos deberán 
                contratar los servicios de limpieza de trampas de grasa y recolección de desechos, 
                evitando que estos se incorporen en el sistema de drenaje. `
            },
            {
                title:'¿COEPRIS se relaciona en el trámite?',
                content: `Si, en el caso de giros comerciales que involucren el manejo de alimentos y bebidas 
                es necesario que la Comisión Estatal para la Protección contra Riesgos Sanitarios 
                (COEPRIS) emita un aviso de funcionamiento de Licencia Sanitaria. `
            },
            {
                title: '¿Por qué me dice que el establecimiento queda sujeto a visita(s) de inspección?',
                content: `El objetivo de las visitas de inspección es verificar que los establecimientos cumplan 
                con los requisitos solicitados por la <strong>Dirección de Medio Ambiente del H. 
                Ayuntamiento de La Paz</strong>.`
            }
        ]
    },
    {
        title:"proteccionCivil",
        subtitle:'Protección Civil',
        description:'Solventa tus dudas sobre las inspecciones y manuales de Protección Civil.',
        preguntas: [
            {
                title: '¿Es necesaria la inspección física?',
                content: `<strong>Si</strong>, ahí se identificarán las medidas adicionales que debe de tomar el 
                establecimiento para garantizar la seguridad e integridad de las personas que 
                asistan. En caso de no cumplir con las medidas de Protección Civil en el plazo 
                correspondiente, se anulará la Licencia de Funcionamiento 2024 y deberá volver a 
                solicitarla.`
            },
            {
                title: '¿Cómo elaboro el Programa Interno de Protección Civil?',
                content: `Ingrese a la <a href="http://www.proteccioncivil.gob.mx/work/models/sismos/Resource/37/1/images/gteipipc.pdf">Guía Interna para
                la Elaboración del Programa Interno de Protección Civil.</a>`
            },
            {
                title: '¿Cómo observar el estatus del trámite?',
                content: `Iniciar sesión con su cuenta dentro del <a href="https://tramites.lapaz.gob.mx/login">
                Portal de Trámites y Servicios en Línea</a>
                En la opción de TRÁMITES, y MIS TRÁMITES ACTIVOS, podrá identificar el ID de 
                su trámite, el trámite que está realizando, nombre y el estatus de su trámite por 
                cada entidad, en seguida tendrá la opción de IR, al seleccionar esta opción podrá 
                ver cada detalle de su trámite de licencia de funcionamiento, el Id de su trámite, la 
                entidad revisora, el estado de su trámite, el estatus de pagos,la opción para 
                descargar sus avisos de entero así como las observaciones o requisitos solicitados.`
            },
            {
                title: '¿Dónde Visualizar las observaciones solicitadas?',
                content: `Una vez iniciada la sesión dentro del <a href="https://tramites.lapaz.gob.mx/login">
                Portal de Trámites y Servicios en Línea</a>, en la 
                opción de Trámites, “Mis Trámites Activos” , a lado derecho de su pantalla estará la 
                opción de “IR”, al entrar podrá observar cada entidad revisora, sus detalles, así 
                como las observaciones solicitadas.`
            }
        ]
    },
    {
        title:'serciosPublicos',
        subtitle:'Servicios Públicos',
        description:'Información sobre la recolección de basura público y privado.',
        preguntas: [
            {
                title: '¿Cómo puedo cambiar de recolector de basura privado a público o de público a privado?',
                content: `Es necesario acercarse al área de Servicios públicos para corroborar la situación de 
                no adeudo. Posteriormente, se podrá realizar la solicitud a través del correo <a href="mailto:serviciospublicos@lapaz.gob.mx">
                serviciospublicos@lapaz.gob.mx</a> o acudir directamente a las oficinas de la <strong>Dirección 
                de Servicios Públicos</strong> ubicada en Carretera Al Sur Kilómetro 5.5, El Mezquitito, 
                23083 La Paz, B.C.S.`
            },
            {
                title: '¿Quién me da el Formato Único Contrato de Adhesión para la Prestación de Servicios de Recolección de Basura?',
                content: `En caso de tener un <strong>contrato privado de Recolección de Basura</strong>, el particular le 
                debe de proporcionar el Formato Único Contrato de Adhesión para la Prestación de 
                Servicios de Recolección de Basura <strong>actualizado para el ejercicio 2024</strong>.`
            },
            {
                title: '¿El costo del servicio recolección de basura público es igual para todos los establecimientos?',
                content: `El costo por el servicio de recolección de basura varía dependiendo del tamaño de 
                la empresa. Para más información favor de contactarse al <strong>612-123-7900 ext. 3004</strong> a 
                la Dirección de Servicios Públicos Municipales al área de Inspección, Vía Pública y 
                Giros Comerciales del H. Ayuntamiento de La Paz.`
            },
            {
                title: '¿Cómo obtengo el Convenio de Relleno Sanitario?',
                content: `Es necesario acudir a la <strong>Dirección General de Servicios Públicos Municipales</strong>, 
                ubicado en la Carretera al sur k.m. 5.5 col. el mezquitito (a lado de la federal de 
                caminos) de lunes a viernes entre  8:00 a.m. y 15:00 p.m. Además de llevar:
                <ol>
                    <li>- Formato de solicitud de convenio de Relleno Sanitario, el cuál será entregado 
                    en el módulo de la Dirección General de Servicios Públicos Municipales.</li>
                    <li>- Ubicación exacta del establecimiento.</li>
                </ol>`
            },
            {
                title: '¿Cómo es la recolección de basura de un local dentro de una plaza comercial?',
                content: `La plaza comercial es la encargada de la recolección de basura.`
            }
        ]
    },
]


export const preguntasCuenta = {
    1: { 
      title: '¿Cómo crear una cuenta?', 
      content: `
      <p style="font-weight: bold;">Ingresa a la página de <a href="https://tramites.lapaz.gob.mx/register">registro de usuarios para el Portal de Trámites y Servicios en Línea</a>, selecciona la opción “REGÍSTRATE”, al ingresar va a necesitar:</p>
      <ul style="padding-left:4%">
        <li>- Nombre completo</li>
        <li>- RFC</li>
        <li>- Curp</li>
        <li>- Correo electrónico.</li>
        <li>- Contraseña para el portal de Trámites y servicios.</li>
        <li>- Aceptar los términos y condiciones.</li>
      </ul>
      Una vez registrado, le llegará una notificación de confirmación a su correo registrado. (Si se trata de persona moral, capture los datos del representante legal).
      Una vez creado su registro, podrá iniciar sesión en el Portal de Trámites y Servicios.
      ` 
    },
    2: { 
        title: '¿Cómo cambiar el correo electrónico?', 
        content: `
        En caso de no tener acceso al correo registrado, deberá solicitar el cambio en la <strong>ventanilla de la Dirección de Comercio del 
        H. Ayuntamiento de La Paz</strong> o mediante una solicitud de cambio 
        de correo electrónico a la siguiente dirección: <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> donde deberá anexar:
        <ul style="padding-left:4%">
          <li>- Identificación del propietario o representante legal.</li>
          <li>- ID del trámite.</li>
          <li>- Nombre.</li>
          <li>- CURP</li>
          <li>- RFC</li>
          <li>- Correo electrónico nuevo.</li>
          <li>- Documento de propiedad o acta que lo acredite.</li>
        </ul>
        ` 
      },
      3: { 
        title: '¿Cómo cambiar la contraseña de mi usuario registrado?', 
        content: `
        En caso de no tener acceso al portal de Trámites y Servicios en Línea:
        <ol>
          <li>- Ingresar al <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
          <li>- Ingresar en la opción de recuperar contraseña.</li>
          <li>- Ingresar el correo registrado.</li>
          <li>- Solicita el enlace para restablecer la contraseña.</li>
          <li>- Al correo registrado, le llegará un enlace para ingresar su nueva contraseña.</li>
        </ol>

        En caso de poder iniciar sesión dentro del portal de trámites y servicios en línea, podrá observar la opción: “Actualizar Datos” donde podrá actualizar su contraseña.
        ` 
      },
      4: { 
        title: '¿Cómo recuperar una cuenta si no tengo acceso al correo?', 
        content: `
        En caso de no tener acceso al correo registrado, podrá solicitar el cambio de correo en la <strong>ventanilla de la Dirección de Comercio del 
        H. Ayuntamiento de La Paz</strong> o mediante una solicitud a la siguiente dirección: <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> en donde deberá anexar:
        <ul style="padding-left:4%">
          <li>- Identificación del propietario</li>
          <li>- ID del trámite.</li>
          <li>- Correo nuevo.</li>
          <li>- Documento de propiedad o acta que lo acredite.</li>
        </ul>
        ` 
      },
      5: { 
        title: '¿Qué hago si me dice que mi RFC o CURP ya está en uso?', 
        content: `
        Si usted ha realizado un trámite en la dirección de comercio, inicie sesión con su correo y contraseña, en caso de no recordarla, vaya al apartado de OLVIDÉ MI CONTRASEÑA y siga las instrucciones.
        <br><br>
        Si un gestor manejaba sus trámites, este creó una cuenta con su RFC y/o CURP para poder administrar sus 
        trámites dentro de la Dirección de Comercio por el H. Ayuntamiento de La Paz, si ya no va a llevar a cabo 
        sus trámites con un gestor, es necesario que el contribuyente solicite al correo <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> el 
        cambio de correo, agregando el nuevo correo y el nombre, CURP, RFC e INE del propietario. Si va a seguir 
        administrando su trámite con su gestor, es necesario que le pida a éste su correo y contraseña.
        <br><br>
        Si no ha realizado trámites, favor de acudir a <strong>ventanilla de la Dirección de Comercio del 
        H. Ayuntamiento de La Paz</strong> o mandar correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> solicitando más información al respecto.
        ` 
      },
      6: { 
        title: '¿Qué hago si no puedo acceder a mi cuenta porque la manejaba un gestor?', 
        content: `
        El contribuyente tiene que solicitar al correo <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a>
         el cambio de correo, agregando el ID del trámite, el nuevo correo y el nombre, CURP, RFC, e INE del propietario y/o representante legal.
        ` 
      },
      7: { 
        title: 'No he recibido el correo de verificación', 
        content: `
        <ol>
          <li>- Ingresa a <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
          <li>- Intenta iniciar sesión con el correo electrónico y contraseña asociada al registro.</li>
          <li>- Si no puede iniciar sesión, solicitará de nueva cuenta un enlace para la verificación de correo.</li>
          <li>- En la bandeja de entrada de su correo personal o el correo registrado, aparecerá la siguiente ventana con el mensaje "Se detectó que aún no confirmas tu correo electrónico".</li>
          <li>- Da clic en "Vuelve a mandar la notificación" que se encuentra al final del mensaje.</li>
          <li>- Revisa tu bandeja de entrada de correo electrónico y/o revisa el apartado de "spam" y da click en el botón "Verifica tu correo electrónico".</li>
        </ol>
        ` 
      },
      8: { 
        title: '¿Tienes problemas de carga o acceso a la página?', 
        content: `
        <ul style="padding-left:4%">
          <li>- Verifica que tu conexión a una red WiFi cuente con señal estable o con un servicio de datos móviles activado.</li>
          <li>- Borra el historial o caché/cookies de tu dispositivo móvil u ordenador e ingresa al <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
        </ul>
        ` 
      }
};
  
const preguntasLicencias = {
    101: {
        title: '¿Qué requisitos/documentos se requieren para realizar el trámite en línea de mi licencia de funcionamiento?',
        content: `Necesitas entregar los siguientes documentos:
        <ul style="padding-left:4%">
            <li>- Identificación oficial por ambos lados.</li>
            <li>- Constancia de situación fiscal.</li>
            <li>- Foto de la fachada del negocio</li>
            <li>- Comprobante de uso de suelo emitido por el H. Ayuntamiento de La Paz.</li>
            <li>- Licencia de uso de edificación.</li>
            <li>- Copia de credencial de elector del solicitante en caso de ser persona física, o acta constitutiva, para personas morales.</li>
            <li>- Constancia de no retardo en pago del impuesto predial.</li>
            <li>- Constancia sanitaria.</li>
            <li>- Título de propiedad, contrato de arrendamiento u otro instrumento jurídico que acredite el derecho real que tiene sobre el inmueble.</li>
            <li>- Acreditar que el inmueble donde se está solicitando la autorización de licencia no guarde adeudos generados por cualquier contribución municipal.</li>
            <li>- Acreditar personalidad.</li>
            <li>- Dictamen de factibilidad de operación emitido por la Dirección Municipal de Protección Civil que conste que el establecimiento cumple con las condiciones necesarias para operar con el giro solicitado.</li>
            <li>- Ser independiente de casa-habitación (excepto restaurantes, cafés, fondas y cenadurías).</li>
            <li>- El establecimiento debe encontrarse en condiciones materiales adecuadas para brindar el servicio con el giro solicitado.</li>
            <li>- Carta de no antecedentes penales.</li>
            <li>- Constancia que acredite al alta en la Secretaría de Hacienda y Crédito Público.</li>
            <li>- Contar con la anuencia vecinal para la apertura del negocio.</li>
            <li>- Contar previamente con la construcción de Rampa para Discapapcitados para el acceso al local.</li>
        </ul>`
    },
    102: {
        title: '¿Cuál es el proceso para realizar una apertura de licencia de funcionamiento?',
        content: `
        <ol>
            <li>- Ingresa al <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a></li>
            <li>- Registrarse como usuario del portal de trámites y servicios:</li>
            <li>- En el campo de Expediente Digital, añadir la documentación que se solicita.</li>
            <ul style="padding-left:4%">
                <li>- Identificación por ambos lados.</li>
                <li>- Comprobante de domicilio de SAPA (Propietario).</li>
                <li>- Constancia de Situación Fiscal (Opcional).</li>
                <li>- Pasaporte (Opcional).</li>
                <li>- Acta constitutiva (En caso de persona moral).</li>
            </ul>
            <br>
            <li>- Seleccionar la opción de trámites disponibles.</li>
            <li>- Seleccionar la opción de "Iniciar Trámite" de licencia de funcionamiento.</li>
            <li>- Completar la información del establecimiento:</li>
            <ul style="padding-left:4%">
                <li>- Nombre comercial del establecimiento.</li>
                <li>- Teléfono del establecimiento.</li>
                <li>- Giros comerciales.</li>
                <li>- Descripción de la actividad.</li>
                <li>- Fecha de inicio de operaciones.</li>
                <li>- Cámara de comercio.</li>
                <li>- Seleccionar si tendrá venta de alcohol.</li>
                <li>- Comprobante de domicilio del establecimiento de SAPA.</li>
                <li>- Foto frontal del establecimiento.</li>
                <li>- Seleccionar horarios de operación.</li>
                <li>- Dirección del establecimiento.</li>
                <li>- Seleccionar a quién le pertenece el predio y cargar el documento jurídico que acredite la propiedad.</li>
            </ul>
            <br>
            <li>- Completar la información del predio.</li>
            <ul style="padding-left:4%">
                <li>- Seleccionar tipo de predio.</li>
                <li>- Escribir la clave catastral o folio y verificar que no tenga adeudos.</li>
                <li>- Seleccionar el periodo de recolección de desechos y el volumen de generación.</li>
                <li>- Seleccionar en el mapa la ubicación exacta del establecimiento.</li>
                <li>- Ingresar la superficie construida del establecimiento.</li>
                <li>- Seleccionar los cajones del establecimiento.</li>
                <li>- Seleccionar el tipo de negocio.</li>
                <li>- Si cuenta con anuncio publicitario, completar las características solicitadas.</li>
                <li>- Seleccionar el tamaño de la empresa.</li>
                <li>- Llenar los campos estadísticos y seleccionará  si cuenta con personas con capacidades diferentes.</li>
            </ul>
            <br>
            <li>- Si va a facturar, seleccionar el régimen fiscal e ingresar la dirección del establecimiento.</li>
            <li>- Enviar la  solicitud de registro del establecimiento.</li>
        </ol>
        `
    },
    103: {
        title: '¿Cuál es el proceso para realizar el refrendo de una licencia?',
        content: `Acudir a tesorería con la licencia original y último refrendo, en su caso, denuncia de robo ante las autoridades competentes, o la manifestación bajo protesta de decir verdad, pasada ante la fé notarial del extravío de solicitud. Posteriormente, solicitar el refrendo de la licencia y paga.`
    },
    104: {
        title: '¿Cómo se realiza el refrendo de alcohol?',
        content: `Acudir a <strong>Tesorería del H. Ayuntamiento de La Paz</strong> con la licencia de funcionamiento pagada y activa  y solicitar el refrendo de licencia de alcohol.`
    },
    105: {
        title: '¿Cómo vincular la licencia de alcohol a la licencia de funcionamiento?',
        content: `Se registra primero la licencia de funcionamiento y se selecciona que se requiere licencia de alcohol, de esta forma será posible entrar al consejo.`
    },
    106: {
        title: '¿Qué requisitos necesito para agregar la persona moral en mi trámite de licencia de funcionamiento?',
        content: `Necesita entregar la siguiente documentación:
        <ul style="padding-left:4%">
            <li>- Razón social.</li>
            <li>- Régimen fiscal.</li>
            <li>- Régimen cpaital.</li>
            <li>- RFC.</li>
            <li>- Acta Constitutiva o Poder Notarial.</li>
            <li>- Direeción geográfica: Calles, número exterior, número interior, código postal y colonia.</li>
            <li>- Seleccionar la ubicación en el mapa.</li>
            <li>- Ingresar la dirección de notificación.</li>
        </ul>`
    },
    107: {
        title: '¿Se debe de subsanar la licencia 2023 para poder obtener la licencia 2024?',
        content: `Si es un negocio que existe anterior al 2024, es necesario subsanar la licencia de
        funcionamiento 2023. De caso contrario, con la licencia de funcionamiento 2024 es
        suficiente.`
    },
    108: {
        title: 'No puedo generar trámite, me marca adeudo de predial.',
        content: `Para poder realizar los trámites es necesario <strong>no tener adeudos</strong> con el H. Ayuntamiento de La Paz.`
    },
    109: {
        title: '¿Me pueden revocar la licencia de funcionamiento?',
        content: `Si, las licencias están condicionadas al cumplimiento de todos los requisitos impuestos por las distintas direcciones del H. Ayuntamiento de La Paz, en caso de no cumplir con uno o más, la licencia de funcionamiento será revocada y se tendrá que iniciar el trámite nuevamente.`
    },
    110: {
        title: 'Soy un negocio semifijo, ¿tengo que sacar mi licencia de funcionamiento?',
        content: `Primero es necesario acudir a <strong>Movilidad y Espacio Público</strong> ubicado en la segunda planta del <strong>H. Ayuntamiento de La Paz</strong>, en donde ellos determinarán si el negocio necesita licencia de funcionamiento.`
    },
    111: {
        title: 'Soy un mercado municipal, ¿debo tramitar mi licencia de funcionamiento?',
        content: `Si, debido a que la recolección de basura de los negocios internos del mercado queda a responsabilidad del Mercado Municipal en el que estén situados.`
    },
    112: {
        title: '¿Cómo puedo obtener la licencia de funcionamiento de un comercio si estoy arrendando el establecimiento?',
        content: `Es necesario presentar el contrato de arrendamiento para poder obtener la licencia de funcionamiento.`
    },
    113: {
        title: '¿Cuál es la diferencia entre una licencia de funcionamiento PRO SARE y una regular?',
        content: `La licencia de funcionamiento SARE corresponde al principal trámite para abrir empresas de bajo riesgo. Mientras que las regulares son para empresas de Mediano y Alto impacto.`
    },
    114: {
        title: '¿En cuánto tiempo estará listo el trámite de mi licencia de funcionamiento?',
        content: `<strong>Para Micro-Pequeña- mediana o grande empresa de bajo riesgo.<br></strong>
        Se crea el SARE, como un mecanismo que integra y consolida todos los trámites municipales para abrir una micro, pequeña, mediana o grande empresa que realice  actividades de bajo riesgo para la salud, seguridad y el medio ambiente garantizando el inicio de operaciones en un máximo de tres días hábiles, a partir del ingreso de la solicitud debidamente integrada.
        <br>
        <strong><br>Para Micro-Pequeña- mediana o grande empresa de mediano/alto riesgo.<br></strong>
        Para abrir una micro, pequeña, mediana o grande empresa que realice  actividades de mediano o alto riesgo para la salud, seguridad y el medio ambiente garantizando el inicio de operaciones en un máximo de 10 días hábiles, a partir del ingreso de la solicitud debidamente integrada.`
    }
}

const preguntasComercio = {
    201: {
        title: '¿Cómo se agrega una persona moral?',
        content: `Si se realizó el trámite como persona física, pero realmente es una persona moral, 
        en la plataforma <a href="https://tramites.lapaz.gob.mx/">Portal de Trámites y Servicios en Línea</a>, dentro de su cuenta, hay un apartado 
        llamado Persona Moral,  en donde puede agregar los datos de la persona moral en 
        cuestión. Posterior a esto, hay que solicitar en <strong>ventanilla de la Dirección de Comercio del 
        H. Ayuntamiento de La Paz</strong> o por correo a 
        <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> que se vincule la persona moral al ID del trámite. Los 
        avisos de pago que tenía en plataforma se eliminarán y se le generarán nuevos 
        para que pueda facturar como persona moral.`
    },
    202: {
        title: '¿Cómo cambiar el nombre comercial?',
        content: `Hay que solicitar en <strong>ventanilla de la Dirección de Comercio del 
        H. Ayuntamiento de La Paz</strong> o por correo a 
        <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> que se 
        haga el cambio de nombre comercial, anexando el nombre actual, el ID del negocio, 
        el nombre al que se quiere cambiar y una copia de una identificación oficial del 
        propietario del comercio.`
    },
    203: {
        title: '¿Cómo agregar giros comerciales?',
        content: `Hay que solicitar en <strong>ventanilla de la Dirección de Comercio del 
        H. Ayuntamiento de La Paz</strong> o por correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> que se 
        agreguen los giros comerciales, así como el listado de los requeridos. En caso de 
        que alguno de los giros comerciales anexados sea de alto impacto y previamente el 
        contribuyente haya estado como bajo impacto, deberá subsanar la actualización de cobros 
        de esa cuota.`
    },
    204: {
        title: '¿Cómo sé el impacto de un establecimiento?',
        content: `El giro comercial es el que determina el impacto de una empresa, si el 
        establecimiento tiene diversos giros, se va a tomar como impacto de la empresa el 
        giro con mayor impacto.`
    },
    205: {
        title: '¿Cómo sé el tamaño de mi empresa?',
        content: `El tamaño de una empresa se determina por el número de empleados que tiene:
        <ul style="padding-left:4%">
            <li>- Micro: 1-10 empleados.</li>
            <li>- Pequeña: 11-30 empleados.</li>
            <li>- Mediana: 31-100 empleados.</li>
            <li>- Grande: Más de 100 empleados.</li>
        </ul>`
    },
    206: {
        title: '¿Cómo cambio el representante legal de un negocio?',
        content: `El nuevo representante legal debe crear una cuenta nueva en el 
        <a href="https://tramites.lapaz.gob.mx/register">Portal de Trámites y Servicios en Línea</a> con su nombre, CURP y RFC, así como enviar por 
        correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> la solicitud de traslado de ID del trámite a la 
        cuenta nueva, así como adjuntar el nuevo poder y la INE, para poder ser validado.`
    },
    207: {
        title: '¿Cómo cambio el propietario del comercio?',
        content: `El nuevo propietario legal debe crear una cuenta nueva en el
        <a href="https://tramites.lapaz.gob.mx/login">Portal de Trámites y Servicios en Línea</a>  con su nombre, CURP y RFC, así como enviar por 
        correo a <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> la solicitud de traslado de ID del trámite a la 
        cuenta nueva, así como la INE del nuevo propietario y del propietario anterior, así 
        como un permiso escrito y firmado por el propietario anterior.`
    },
    208: {
        title: '¿Qué hago si me equivoqué al elegir el tamaño de la empresa?',
        content: `<strong>Si aún no tiene pagos realizados que le afecten y quiere bajar o subir el tamaño de 
        la empresa</strong>, se requiere la liberación de tamaño de empresa a la Dirección de 
        Gobierno Digital del H. Ayuntamiento de La Paz, para que el contribuyente vuelva a 
        elegirlo desde su cuenta.

        <strong><br><br>Si el contribuyente ya realizó pagos de servicios públicos, ecología y/o protección 
        civil en tamaño de empresa menor y requiere subir el tamaño</strong>, se pide a la 
        Dirección de Gobierno Digital del H. Ayuntamiento de La Paz la liberación del 
        tamaño de empresa y se cancelan los avisos, por lo que queda saldo a favor de lo 
        pagado y se pide que se le generen los avisos de pago correctos, para que ahí se 
        aplique el saldo a favor y se pague lo restante. 

        <strong><br><br>Si el contribuyente ya realizó pagos de servicios públicos, ecología y/o protección 
        civil en tamaño de empresa mayor y se requiere bajar el tamaño</strong>, se solicita 
        mediante oficio dirigido a la Dirección de Comercio del H. Ayuntamiento de La Paz 
        que se modifique el tamaño de la empresa, argumentando cuál es el tamaño 
        correcto, después se inspecciona el comercio y ya que se recibe el reporte de la 
        inspección y da un resultado congruente, la Dirección de Comercio realiza el 
        cambio de tamaño de la empresa, se cancelan los avisos de pago, dejando a favor 
        de lo pagado y se solicita que se le generen los avisos correctos, para que ahí se le 
        aplique el saldo a favor.`
    },
    209: {
        title: '¿Qué hago si mi trámite 2023 tuvo errores y no avanzó?',
        content: `Si el error está en la foto de comercio, comprobante de domicilio y(o 
        documento de propiedad, se debe solicitar al correo <a href="mailto:info.comercio@lapaz.gob.mx">info.comercio@lapaz.gob.mx</a> 
        que se habilite el campo para volver a subir el documento correcto, así el 
        contribuyente, posterior a esto, podrá ingresar y subsanar el documento.

        Si el error está en la clave catastral, no hay manera de modificarlo, por lo que se 
        debe solicitar la eliminación del ID del trámite por oficio, sustentando la petición y 
        volviendo a realizar el trámite en su cuenta con la clave catastral correcta, como 
        una apertura en el año fiscal.`
    },
    210: {
        title: '¿Cómo hacer la modificación de metros cuadrados?',
        content: `Se requiere redactar un oficio dirigido a la <strong>Dirección de Comercio del H. 
        Ayuntamiento de La Paz</strong> solicitando la habilitación de la modificación de metros 
        cuadrados de un establecimiento, posteriormente recibirá notificación de que el 
        apartado ya puede ser alterable para que realice las modificaciones correspondientes.`
    },
    211: {
        title: '¿Qué es un ID?',
        content: `<strong>Identificador único</strong> para cada orden que usted ha iniciado en nuestra plataforma de 
        Trámites y Servicios.`
    },
    212: {
        title: '¿Cuál es el ID de mi trámite?',
        content: `Al iniciar sesión con su cuenta dentro del <a href="https://tramites.lapaz.gob.mx/login">
        Portal de Trámites y Servicios en Línea</a>, en 
        la opción de TRÁMITES, y MIS TRÁMITES ACTIVOS, podrá identificar el ID de su 
        trámite, el trámite que está realizando, nombre y el estatus de su trámite por cada 
        entidad.`
    },
    213: {
        title: '¿Cuál es el ID del negocio?',
        content: `El ID del negocio es el <strong>identificador único</strong> que tiene el establecimiento comercial, 
        ayuda a obtener el listado de trámites que ha realizado el contribuyente de ese 
        negocio en la Dirección de Comercio del H. Ayuntamiento de La Paz`
    },
    214: {
        title: '¿Cómo elimino un ID?',
        content: `Se tiene que hacer la petición mediante un oficio dirigido a la <strong>Dirección de Comercio 
        del H. Ayuntamiento de La Paz</strong>, sustentando la razón por la cual hace la solicitud. `
    },
    215: {
        title: '¿Cuál es la diferencia entre el ID de mi trámite y el  ID de mi negocio?',
        content: `El ID del trámite corresponde al procedimiento que se está realizando, mientras que 
        el ID del negocio es de un establecimiento. En el caso del seguimiento de trámites, 
        es necesario proporcionar el ID del trámite.`
    },
    216: {
        title: '¿Cuándo debo de ingresar la clave catastral y cuando el folio?',
        content: `Dependiendo del tipo de asentamiento es lo que vas a registrar. Para la Zona 
        Rústica tienes que poner el folio, mientras que para la Zona Urbana debes poner la 
        clave catastral. `
    },
    217: {
        title: '¿Qué es la clave catastral?',
        content: `Código de identificación único que se asigna a cada inmueble dentro del municipio 
        de La Paz. Esta clave sirve para identificar de manera precisa y única a cada predio 
        o parcela dentro de un registro oficial, es asignado conforme al catálogo de 
        regiones que defina la propia entidad.
        <br><br>
        <strong>Ejemplo clave catastral:</strong> 602-017-004-804`
    },
    218: {
        title: '¿Qué es el folio de predio?',
        content: `Código de identificación único oficial que acredita que el inmueble se encuentra 
        registrado en el padrón catastral y de impuesto predial a favor del propietario.
        <br><br>
        <strong>Ejemplo folio de predio:</strong> 115074`
    },
    219: {
        title: '¿En donde veo los datos de mi inmueble para el registro de una Licencia de Funcionamiento?',
        content: `Si no conoce la clave catastral o el folio del predio acuda a la <strong>Ventanilla de la 
        Dirección de Catastro del H. Ayuntamiento de La Paz</strong> y con el nombre completo del 
        dueño se busca en archivo, en caso de que la persona cuente con más de una 
        propiedad, se solicita la dirección del predio.`
    }
}

const preguntasServPub = {
    301: {
        title: '¿Cómo puedo cambiar de recolector de basura privado a público o de público a privado?',
        content: `Es necesario acercarse al área de Servicios públicos para corroborar la situación de 
        no adeudo. Posteriormente, se podrá realizar la solicitud a través del correo <a href="mailto:serviciospublicos@lapaz.gob.mx">
        serviciospublicos@lapaz.gob.mx</a> o acudir directamente a las oficinas de la <strong>Dirección 
        de Servicios Públicos</strong> ubicada en Carretera Al Sur Kilómetro 5.5, El Mezquitito, 
        23083 La Paz, B.C.S.`
    },
    302: {
        title: '¿Quién me da el Formato Único Contrato de Adhesión para la Prestación de Servicios de Recolección de Basura?',
        content: `En caso de tener un <strong>contrato privado de Recolección de Basura</strong>, el particular le 
        debe de proporcionar el Formato Único Contrato de Adhesión para la Prestación de 
        Servicios de Recolección de Basura <strong>actualizado para el ejercicio 2024</strong>.`
    },
    303: {
        title: '¿El costo del servicio recolección de basura público es igual para todos los establecimientos?',
        content: `El costo por el servicio de recolección de basura varía dependiendo del tamaño de 
        la empresa. Para más información favor de contactarse al <strong>612-123-7900 ext. 3004</strong> a 
        la Dirección de Servicios Públicos Municipales al área de Inspección, Vía Pública y 
        Giros Comerciales del H. Ayuntamiento de La Paz.`
    },
    304: {
        title: '¿Cómo obtengo el Convenio de Relleno Sanitario?',
        content: `Es necesario acudir a la <strong>Dirección General de Servicios Públicos Municipales</strong>, 
        ubicado en la Carretera al sur k.m. 5.5 col. el mezquitito (a lado de la federal de 
        caminos) de lunes a viernes entre  8:00 a.m. y 15:00 p.m. Además de llevar:
        <ol>
            <li>- Formato de solicitud de convenio de Relleno Sanitario, el cuál será entregado 
            en el módulo de la Dirección General de Servicios Públicos Municipales.</li>
            <li>- Ubicación exacta del establecimiento.</li>
        </ol>`
    },
    305: {
        title: '¿Cómo es la recolección de basura de un local dentro de una plaza comercial?',
        content: `La plaza comercial es la encargada de la recolección de basura.`
    }
}

const preguntasUsoSuelo = {
    401: {
        title: '¿Cómo puedo obtener el uso de suelo si soy arrendatario del local comercial?',
        content: `En vez de solicitar la escritura se pide el contrato de arrendamiento con copia de la 
        identificación oficial del arrendador y el arrendatario y que el predial y escritura 
        coincida con el contrato. Además es necesario que el pago del predial esté al 
        corriente y que la clave catastral coincida con la establecida en el contrato de arrendamiento.`
    },
    402: {
        title: '¿Qué es el Reglamento de Imagen Urbana?',
        content: `Es la normativa encargada de ordenar y regular la imagen urbana de las zonas 
        centro y áreas patrimoniales de las poblaciones en el municipio de La Paz. Puedes 
        consultarlo en el <a href="https://lapaz.gob.mx/images/marco-normativo/Reglamento-de-Imagen-Urbana-del-Municipio-de-La-Paz-BCS_BOGE-Num25_10-07-2017.pdf">
        Reglamento de Imagen Urbana del Municipio de La Paz.</a>`
    },
    403: {
        title: '¿Por qué me sale que el uso de suelo está autorizado sujeto a revisión técnica?',
        content: `Acorde al Artículo 123 la Ley de Hacienda para el Municipio de La Paz, todas las 
        licencias comerciales <strong>mayores a 500 metros de construcción</strong> en los usos 
        comerciales queda sujeta a revisión técnica.`
    },
    404: {
        title: '¿Debo solicitar permiso para la colocación de anuncios?',
        content: `De acuerdo a los Artículos 6 y 8 del Reglamento de Anuncios para el Municipio de 
        La Paz, Baja California Sur, es necesario solicitar permiso para la colocación de 
        anuncios en la fachada de su establecimiento.`
    }
}

const preguntasProteccionCivil = {
    501: {
        title: '¿Es necesaria la inspección física?',
        content: `<strong>Si</strong>, ahí se identificarán las medidas adicionales que debe de tomar el 
        establecimiento para garantizar la seguridad e integridad de las personas que 
        asistan. En caso de no cumplir con las medidas de Protección Civil en el plazo 
        correspondiente, se anulará la Licencia de Funcionamiento 2024 y deberá volver a 
        solicitarla.`
    },
    502: {
        title: '¿Cómo elaboro el Programa Interno de Protección Civil?',
        content: `Ingrese a la <a href="http://www.proteccioncivil.gob.mx/work/models/sismos/Resource/37/1/images/gteipipc.pdf">Guía Interna para
        la Elaboración del Programa Interno de Protección Civil.</a>`
    },
    503: {
        title: '¿Cómo observar el estatus del trámite?',
        content: `Iniciar sesión con su cuenta dentro del <a href="https://tramites.lapaz.gob.mx/login">
        Portal de Trámites y Servicios en Línea</a>
        En la opción de TRÁMITES, y MIS TRÁMITES ACTIVOS, podrá identificar el ID de 
        su trámite, el trámite que está realizando, nombre y el estatus de su trámite por 
        cada entidad, en seguida tendrá la opción de IR, al seleccionar esta opción podrá 
        ver cada detalle de su trámite de licencia de funcionamiento, el Id de su trámite, la 
        entidad revisora, el estado de su trámite, el estatus de pagos,la opción para 
        descargar sus avisos de entero así como las observaciones o requisitos solicitados.`
    },
    504: {
        title: '¿Dónde Visualizar las observaciones solicitadas?',
        content: `Una vez iniciada la sesión dentro del <a href="https://tramites.lapaz.gob.mx/login">
        Portal de Trámites y Servicios en Línea</a>, en la 
        opción de Trámites, “Mis Trámites Activos” , a lado derecho de su pantalla estará la 
        opción de “IR”, al entrar podrá observar cada entidad revisora, sus detalles, así 
        como las observaciones solicitadas.`
    }
}

const preguntasMedioAmbiente = {
    601: {
        title: '¿Por qué me solicitan trampa de grasa y la recolección de aceite?',
        content: `De acuerdo al Artículo 77 de Reglamento de Preservación, Equilibrio Ecológico y 
        Protección al Medio Ambiente para el Municipio de La Paz, los propietarios de 
        restaurantes o establecimientos comerciales de venta de alimentos deberán 
        contratar los servicios de limpieza de trampas de grasa y recolección de desechos, 
        evitando que estos se incorporen en el sistema de drenaje. `
    },
    602: {
        title:'¿COEPRIS se relaciona en el trámite?',
        content: `Si, en el caso de giros comerciales que involucren el manejo de alimentos y bebidas 
        es necesario que la Comisión Estatal para la Protección contra Riesgos Sanitarios 
        (COEPRIS) emita un aviso de funcionamiento de Licencia Sanitaria. `
    },
    603: {
        title: '¿Por qué me dice que el establecimiento queda sujeto a visita(s) de inspección?',
        content: `El objetivo de las visitas de inspección es verificar que los establecimientos cumplan 
        con los requisitos solicitados por la <strong>Dirección de Medio Ambiente del H. 
        Ayuntamiento de La Paz</strong>.`
    }
}

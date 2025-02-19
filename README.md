
# WhatsApp Client Bot

Este proyecto es un cliente de WhatsApp que permite enviar mensajes y códigos QR de manera masiva a través de una interfaz web.

## Requisitos previos

- Tener instalado **Git** en tu máquina. [Descargar Git](https://git-scm.com/)
- Tener instalado **Node.js**. [Descargar Node.js](https://nodejs.org/)

## Pasos para correr el proyecto

1. **Clonar el repositorio:**

```bash
git clone https://github.com/brianco007/whatsappbotqr.git
```

2. **Navegar al directorio del proyecto:**

```bash
cd whatsappbotqr
```

3. **Instalar las dependencias:**

```bash
npm install
```

4. **Iniciar el servidor:**

```bash
npm run start
```

5. **Abrir el navegador:**

   - Dirígete a `http://localhost:3000`.

6. **Iniciar sesión en WhatsApp:**

   - Haz clic en el botón **Iniciar Sesión con WhatsApp**.
   - Escanea el código QR que aparece en pantalla con la app de WhatsApp en tu teléfono.
   **Ten en cuenta que el código QR cambia cada 30 segundos, entonces no olvides refrescar la página.**

7. **Cargar los contactos desde un JSON:**

   - Ingresa la URL de un JSON con los datos de las personas registradas al evento. Puedes obtener un JSON fácilmente desde [SheetDB](https://sheetdb.io/).

8. **Enviar mensajes:**

   - Escribe el mensaje que deseas enviar a todos los contactos cargados y presiona **Enviar códigos QR**.

## Ejemplo de JSON esperado

El JSON debe tener un formato similar al siguiente. En el caso que el nombre de las columnas cambie, deberá modificar el archivo index.js en lás líneas 89-91.

```json
[
    {
        "CC": "1085313559",
        "Teléfono": "3173253124",
        "Nombre": "Brian",
        "Correo": "briancormin@gmail.com",
        "Código": "1085313559Brian"
    },
    {
        "CC": "1085338458",
        "Teléfono": "3212486892",
        "Nombre": "Dayana Guacales",
        "Correo": "daya@gmail.com",
        "Código": "1085338458Dayana Guacales"
    },
    {
        "CC": "1223455",
        "Teléfono": "3153303801",
        "Nombre": "Felipe",
        "Correo": "Felipe@gmail.com",
        "Código": "1223455Felipe"
    }
]
```

## Tecnologías utilizadas

- **Node.js**
- **whatsapp-web.js**
- **Express.js**

## Notas adicionales

- Asegúrate de que tu teléfono esté conectado a internet para mantener la sesión activa en WhatsApp Web.
- Si la sesión de WhatsApp se cierra, deberás volver a escanear el código QR.

## Contribuciones

Si deseas contribuir a este proyecto, siéntete libre de hacer un fork y enviar un pull request.

## Licencia

Este proyecto está bajo la licencia MIT.

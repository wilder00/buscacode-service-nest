¡Bien! Ahora sí ZAP ya **aceptó tu API Key** y te contestó 👍.
El error que ves:

```
{"code":"url_not_found","message":"URL Not Found in the Scan Tree"}
```

significa:
👉 Estás intentando lanzar un **Active Scan** sobre una URL que **ZAP todavía no conoce**.

ZAP funciona en dos pasos:

---

## 🔹 Paso 1. Spider (explorar la app)

Primero hay que decirle a ZAP que **descubra las rutas** de tu app.
Ejemplo con tu API en `http://192.168.0.104:4321`:

```bash
curl "http://192.168.0.104:8090/JSON/spider/action/scan/?apikey=change-me-9203935709&url=http://192.168.0.104:4321"
```

Eso arranca el **spidering** (exploración de enlaces).

Puedes revisar el progreso con:

```bash
curl "http://192.168.0.104:8090/JSON/spider/view/status/?scanId=0&apikey=change-me-9203935709"
```

Cuando devuelva `"status":"100"` → ya terminó de mapear tu sitio.

---

## 🔹 Paso 2. Active Scan (buscar vulnerabilidades)

Ahora sí, con el sitio en el árbol, lanza el escaneo:

```bash
curl "http://192.168.0.104:8090/JSON/ascan/action/scan/?apikey=change-me-9203935709&url=http://192.168.0.104:4321"
```

Puedes revisar el progreso del Active Scan con:

```bash
curl "http://192.168.0.104:8090/JSON/ascan/view/status/?scanId=0&apikey=change-me-9203935709"
```

---

## 🔹 Paso 3. Reporte en HTML

Cuando el status llegue a `100`, genera el reporte:

```bash
curl "http://192.168.0.104:8090/OTHER/core/other/htmlreport/?apikey=change-me-9203935709" -o reporte.html
```

Abre `reporte.html` en tu navegador → y tendrás el informe con las vulnerabilidades.

---

👉 En resumen:

1. **Spider** (explora URL).
2. **Active Scan** (lanza pruebas).
3. **Reporte** (HTML o JSON).

¿Quieres que te arme un **script bash de 5 líneas** que haga esos tres pasos automáticamente para cualquier URL que le pases?

// Llamamos a nuestros dos ayudantes
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000; // La puerta de entrada a nuestra cocina

// Le decimos al traductor que prepare todo para entender notas JSON
app.use(bodyParser.json());

// Esta será nuestra "caja de juguetes" donde guardaremos los usuarios registrados
const usuariosDB = [];
app.post('/api/register', (req, res) => {
    // Leemos el usuario y la clave que nos enviaron
    const { usuario, contrasena } = req.body;

    // Regla 1: Si no nos enviaron el usuario o la clave, nos quejamos
    if (!usuario || !contrasena) {
        return res.status(400).json({
            estado: 'error',
            mensaje: 'Por favor escribe un usuario y una contraseña'
        });
    }

    // Regla 2: Revisamos si esa persona ya estaba guardada en nuestra caja
    const usuarioExiste = usuariosDB.find(u => u.usuario === usuario);
    if (usuarioExiste) {
        return res.status(400).json({
            estado: 'error',
            mensaje: '¡Este usuario ya existe!'
        });
    }

    // Si todo está bien, lo guardamos en la caja
    usuariosDB.push({ usuario, contrasena });

    return res.status(201).json({
        estado: 'exito',
        mensaje: '¡Te has registrado con éxito en EduFamilias!'
    });
});
app.post('/api/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    // Buscamos en la caja si existe alguien con ESE usuario y ESA clave
    const usuarioValido = usuariosDB.find(
        u => u.usuario === usuario && u.contrasena === contrasena
    );

    // Si lo encontramos en la caja:
    if (usuarioValido) {
        return res.status(200).json({
            estado: 'exito',
            mensaje: 'Autenticación satisfactoria. ¡Bienvenido a EduFamilias!'
        });
    } else {
        // Si no existe o la clave está mal:
        return res.status(401).json({
            estado: 'error',
            mensaje: 'Error en la autenticación: usuario o contraseña incorrectos'
        });
    }
});

// Le decimos al servidor que empiece a escuchar en la puerta 3000
app.listen(PORT, () => {
    console.log(`El mesero está listo esperando en el puerto http://localhost:${PORT}`);
});
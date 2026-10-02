const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Bases de datos temporales en memoria
let usuariosDB = [];
let estudiantesDB = [
  { id: 1, nombre: "Juan Pérez", grado: "8A", acudiente: "padre@edufamilias.edu.co" }
];
let observacionesDB = [];
let citacionesDB = [];

// ==========================================
// 1. MÓDULO DE AUTENTICACIÓN (Auth API)
// ==========================================
app.post('/api/register', (req, res) => {
  const { usuario, contrasena, rol } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ estado: "error", mensaje: "Faltan campos obligatorios" });
  }
  const existe = usuariosDB.find(u => u.usuario === usuario);
  if (existe) {
    return res.status(400).json({ estado: "error", mensaje: "El usuario ya existe" });
  }
  const nuevoUsuario = { id: usuariosDB.length + 1, usuario, contrasena, rol: rol || "Acudiente" };
  usuariosDB.push(nuevoUsuario);
  res.status(201).json({ estado: "exito", mensaje: "Usuario registrado con éxito", usuario: nuevoUsuario });
});

app.post('/api/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  const user = usuariosDB.find(u => u.usuario === usuario && u.contrasena === contrasena);
  if (user) {
    res.status(200).json({ estado: "exito", mensaje: `Bienvenido a EduFamilias (${user.rol})`, rol: user.rol });
  } else {
    res.status(401).json({ estado: "error", mensaje: "Credenciales incorrectas" });
  }
});

// ==========================================
// 2. MÓDULO DE ESTUDIANTES (CRUD API)
// ==========================================
app.get('/api/estudiantes', (req, res) => {
  res.status(200).json({ estado: "exito", datos: estudiantesDB });
});

app.post('/api/estudiantes', (req, res) => {
  const { nombre, grado, acudiente } = req.body;
  if (!nombre || !grado) {
    return res.status(400).json({ estado: "error", mensaje: "Nombre y grado son obligatorios" });
  }
  const nuevoEstudiante = { id: estudiantesDB.length + 1, nombre, grado, acudiente };
  estudiantesDB.push(nuevoEstudiante);
  res.status(201).json({ estado: "exito", mensaje: "Estudiante registrado", estudiante: nuevoEstudiante });
});

app.delete('/api/estudiantes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = estudiantesDB.findIndex(e => e.id === id);
  if (index !== -1) {
    estudiantesDB.splice(index, 1);
    res.status(200).json({ estado: "exito", mensaje: "Estudiante eliminado correctamente" });
  } else {
    res.status(404).json({ estado: "error", mensaje: "Estudiante no encontrado" });
  }
});

// ==========================================
// 3. MÓDULO DE OBSERVACIONES (Seguimiento)
// ==========================================
app.get('/api/observaciones', (req, res) => {
  res.status(200).json({ estado: "exito", datos: observacionesDB });
});

app.post('/api/observaciones', (req, res) => {
  const { estudianteId, docente, detalle } = req.body;
  const nuevaObs = { id: observacionesDB.length + 1, estudianteId, docente, detalle, fecha: new Date().toLocaleDateString() };
  observacionesDB.push(nuevaObs);
  res.status(201).json({ estado: "exito", mensaje: "Observación registrada", observacion: nuevaObs });
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor de EduFamilias corriendo en http://localhost:${PORT}`);
});
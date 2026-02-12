const User = require('../models/User');

// Obtener todos los usuarios (sin password)
const obtenerUsuarios = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        res.json({ usuarios: users });
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ mensaje: 'Usuario eliminado correctamente.' });
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({ error: 'Error al eliminar usuario.' });
    }
};

// Cambiar rol de usuario
const cambiarRolUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nivel } = req.body; // 'admin' o 'usuario'

        if (!['admin', 'usuario'].includes(nivel)) {
            return res.status(400).json({ error: 'Rol inválido.' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { nivel },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ mensaje: 'Rol actualizado.', usuario: user });
    } catch (error) {
        console.error("Error cambiando rol:", error);
        res.status(500).json({ error: 'Error al actualizar rol.' });
    }
};

module.exports = {
    obtenerUsuarios,
    eliminarUsuario,
    cambiarRolUsuario
};

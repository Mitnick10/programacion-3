require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
    {
        nombre: "Balón de Fútbol Profesional",
        codigo: "FUT001",
        precio: 45.99,
        descripcion: "Balón oficial tamaño 5, alta resistencia y control.",
        categoria: "Futbol",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=400&q=80"
    },
    {
        nombre: "Zapatillas Running Elite",
        codigo: "RUN001",
        precio: 89.99,
        descripcion: "Zapatillas ligeras con amortiguación para largas distancias.",
        categoria: "Running",
        genero: "Hombre",
        imagen_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80"
    },
    {
        nombre: "Pesas Mancuernas 10kg",
        codigo: "GYM001",
        precio: 35.50,
        descripcion: "Set de dos mancuernas de vinilo de 5kg cada una.",
        categoria: "Gym",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80"
    },
    {
        nombre: "Balón de Baloncesto Pro",
        codigo: "BSK001",
        precio: 39.99,
        descripcion: "Balón de cuero sintético para uso interior y exterior.",
        categoria: "Basketball",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1519861531473-920026393112?w=400&q=80"
    },
    {
        nombre: "Raqueta de Tenis Avanzada",
        codigo: "TEN001",
        precio: 120.00,
        descripcion: "Raqueta de grafito ligera para mayor potencia.",
        categoria: "Tennis",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1617083277636-17b51b7558ec?w=400&q=80"
    },
    {
        nombre: "Gafas de Natación Anti-vaho",
        codigo: "NAT001",
        precio: 15.99,
        descripcion: "Gafas con protección UV y ajuste cómodo.",
        categoria: "Natacion",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1576435728678-38d01d52e38b?w=400&q=80"
    },
    {
        nombre: "Casco de Ciclismo Aerodinámico",
        codigo: "CIC001",
        precio: 55.00,
        descripcion: "Casco ventilado y ligero para seguridad en carretera.",
        categoria: "Ciclismo",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=80"
    },
    {
        nombre: "Esterilla de Yoga Antideslizante",
        codigo: "OTR001",
        precio: 22.50,
        descripcion: "Esterilla de TPE ecológico, 6mm de grosor.",
        categoria: "Otros",
        genero: "Unisex",
        imagen_url: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80"
    },
    {
        nombre: "Camiseta Deportiva Mujer",
        codigo: "ROP001",
        precio: 25.00,
        descripcion: "Camiseta transpirable ideal para entrenamientos.",
        categoria: "Running",
        genero: "Mujer",
        imagen_url: "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&q=80"
    },
    {
        nombre: "Conjunto Deportivo Niños",
        codigo: "KID001",
        precio: 30.00,
        descripcion: "Conjunto cómodo y resistente para actividades escolares.",
        categoria: "Futbol",
        genero: "Niños",
        imagen_url: "https://images.unsplash.com/photo-1519241047957-be31d7379a5d?w=400&q=80"
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        for (const product of products) {
            const result = await Product.findOneAndUpdate(
                { codigo: product.codigo },
                product,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(`✅ Producto procesado: ${result.nombre} (${result.genero})`);
        }

        console.log('🎉 Proceso de carga finalizado.');
        process.exit();
    } catch (error) {
        console.error('❌ Error al agregar productos:', error);
        process.exit(1);
    }
};

seedProducts();

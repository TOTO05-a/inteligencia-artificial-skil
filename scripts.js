const readline = require('readline');

// Crear una interfaz para leer la entrada del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Solicitar una frase al usuario
rl.question("Ingresa una frase: ", (frase) => {
    // Función para convertir la frase en un vector de números
    function fraseAVector(frase) {
        const vector = [];
        for (let i = 0; i < frase.length; i++) {
            vector.push(frase.charCodeAt(i)); // Convertir cada carácter a su valor ASCII
        }
        return vector;
    }

    // Procesar la frase y obtener el vector
    const vectorResultado = fraseAVector(frase);

    // Mostrar el vector en la consola
    console.log("Vector resultante:", vectorResultado);

    // Cerrar la interfaz de lectura
    rl.close();
});
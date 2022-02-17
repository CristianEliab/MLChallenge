# MLChallenge
Examen Técnico

En este repositorio se encontrá la solución del ejercicio técnico entregado por Mercado Libre.

Instrucciones de como ejecutar el código:

1.   Clonar el repositorio, realizar la instalación de las dependencias y ejecución del mismo.

git clone https://github.com/CristianEliab/MLChallenge.git
cd MLChallenge
npm install
npm start

2. Ejecución de la API:

El API se encuentrá ubicado en Google Cloud, en una instancia VM

Nivel 2: 
Ruta: 34.122.51.53/mutant
Metodo: POST
Body: 
{
    "dna": [
        "ATGCGA",
        "CAGTGC",
        "TTGTGT",
        "AGAAGG",
        "CCDCTA",
        "TCACTG"
    ]
}

Nivel 3:
Ruta: 34.122.51.53/stats
Metodo: GET
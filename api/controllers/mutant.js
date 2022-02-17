const moment = require("moment-timezone");

const pg = require("../db/db");

const { isEmpty } = require("../helpers/validations");
const { status } = require("../helpers/status");

const N_OCCURRENCES = 4;

/**
 * Método que permite exponer el servicio de validacion si la persona es mutante
 * @param {*} req
 * @param {*} res
 * @returns
 */
const checkMutant = async (req, res) => {
  try {
    const { dna, nDna } = req.body;
    //nDna es una variable para  parametrizar el numero de repeticiones o occurencias que se quieren buscar
    if (isEmpty(dna)) {
      return res.status(status.bad).send({
        status: false,
        error: "No se envio dna a validar",
      });
    }
    //Se realiza la validacion de la persona
    let occurrences = nDna ? nDna : N_OCCURRENCES;
    let result = isMutant({ dna, occurrences });
    //insert result
    let query = "INSERT INTO stats_registers (type) VALUES ($1, $2)";
    pg.query(query, [result ? "mutant" : "human"]);
    return res.status(result ? status.success : status.forbidden).send({
      status: true,
      isMutant: result,
    });
  } catch (error) {
    res.status(status.error).send({
      error: error,
      status: false,
    });
    let date = moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
    console.log(`Date: ${date}`);
    console.log(`Cause by: ${error}`);
  }
};

/**
 * Solucion aplicada al problema.
 * Se realizara la separacion por filas, columnas y diagonales. Posteriormente, por cada row obtenido se
 * realizara la validacion y conteo de ocurrencias de las letras. Para encontrar las ocurrencias se utiliza el metodo de
 * split que separa los valores cuyas repeticiones sean de 4 valores, esto por cada uno de los registros obtenidos
 * @param {*} param0
 * @returns isMutant
 */
const isMutant = ({ dna, occurrences }) => {
  let nOcurrencesRow = 0,
    nOcurrencescolumn = 0,
    nOcurrencesDiagonal = 0;

  //Se realiza la validacion por filas
  dna.forEach((row) => {
    nOcurrencesRow += checknumberOcurrences({ row, occurrences });
  });
  //Se realiza la validacion por columnas
  for (let j = 0; j < dna.length; j++) {
    let row = "";
    for (let i = 0; i < dna.length; i++) {
      row += dna[i][j];
    }
    nOcurrencescolumn += checknumberOcurrences({ row, occurrences });
  }
  //Se realiza la validacion por diagonales
  for (let i = 1 - dna.length; i < dna.length; i++) {
    let row = "";
    for (
      let x = -getMin(0, i), y = getMax(0, i);
      x < dna.length && y < dna.length;
      x++, y++
    ) {
      row += dna[y][x];
    }
    nOcurrencesDiagonal += checknumberOcurrences({ row, occurrences });
  }

  //Obtener el total de ocurrencias
  let totalOcurrences =
    nOcurrencesRow + nOcurrencescolumn + nOcurrencesDiagonal;
  console.log("**********");
  console.log("totalOcurrences", totalOcurrences);
  console.log("**********");
  return totalOcurrences > 1 ? true : false;
};

const getMin = (a, b) => {
  return a < b ? a : b;
};

const getMax = (a, b) => {
  return a > b ? a : b;
};

/**
 * Proceso de busqueda:
 * 1. Realizo la busqueda de los caracteres por registro.
 * Ejemplo en la cadena ADFGAS, los caracteres serian ADFGS.La idea es identificar loscarasteres sin repeticiones
 * 2. Por cada uno de los caracteres realizo la busqueda de la ocurrencias
 * Ejemplo caracter A --> busco y filtro por ocurrencias de la cadena AAAA
 * 3. Al realizar un split, se divide el resultado en un arreglo de separaciones con ocurrencias encontradas, dado que el split realizara
 * una divicion de mas porcada ocurrencia elimino una de sus repeticiones.
 * Ejemplo:  la cadena AAAABDF, al splitear quedaria un arreglo> ['', 'BDF'] de este el resultado  es que encontro una ocurrencia pero realizo
 * dos separeciones. Por ende, elimino una de ellas.
 * tambien se podria realizando un  busqueda en el arreglor resultando donde el item sea vacio o ''.
 * sin embargo, asuno que el numero de ocurrencias es el total de las separaciones - 1.
 * @param {*} param0
 * @returns
 */
const checknumberOcurrences = ({ row, occurrences }) => {
  let number = 0;
  let chartacters = row.split("").filter(onlyUnique);
  chartacters.forEach((item) => {
    let subject = item.repeat(occurrences);
    let exist = row.split(subject).length - 1;
    number += exist;
  });
  return number;
};

/**
 * Metodo que permite identificar los diferentes caracteres/cadenas de string en un arreglo filtrando por solo una aparicion
 * @param {*} value
 * @param {*} index
 * @param {*} self
 * @returns
 */
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

/**
 * Método que permite obtener cada una de las pruebas realizadas sobre los DNA entregados
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getInfoStats = async (req, res) => {
  try {
    let query = "SELECT * FROM stats_registers ORDER BY id";
    await pg
      .query(query)
      .then((data) => {
        let mutants = data.rows.filter((item) => (item.type = "mutant")).length;
        let humans = data.rows.filter((item) => (item.type = "human")).length;
        let ratio = mutants / humans;
        res.status(status.success).send({
          count_mutant_dna: mutants,
          count_human_dna: humans,
          ratio: ratio,
        });
      })
      .catch((error) => {
        res.status(status.error).send({
          error: error,
          status: false,
        });
      });
  } catch (error) {
    res.status(status.error).send({
      error: error,
      status: false,
    });
    let date = moment().tz("America/Bogota").format("YYYY-MM-DD HH:mm:ss");
    console.log(`Date: ${date}`);
    console.log(`Cause by: ${error}`);
  }
};

module.exports = {
  checkMutant,
  getInfoStats,
};

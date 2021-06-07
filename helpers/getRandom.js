exports.getRandom = () => {
  // funcion para generar un CBU random
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  let numeroCBU1 =
    getRandomInt(38273619777, 756189222) * getRandomInt(981529999, 16391455555);

  let numeroCBU2 =
    getRandomInt(3282700089567, 4716495556) *
    getRandomInt(11727373619999, 1827496666);

  let cbu = numeroCBU1 + numeroCBU2;

  return cbu;
};

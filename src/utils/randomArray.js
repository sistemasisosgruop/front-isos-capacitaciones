const randomArray = ( array ) => {
  // Función de comparación para ordenar aleatoriamente
  function compareRandom() {
    return Math.random() - 0.5;
  }

  // Copia el arreglo original y lo ordena aleatoriamente
  const shuffledArray = array.slice();
  shuffledArray.sort(compareRandom);

  return shuffledArray;
}
 
export default randomArray;
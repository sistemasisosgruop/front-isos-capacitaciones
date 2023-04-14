const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

const formatDateYMD = (date) =>  {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()+ 1),
  ].join('/');
}
export default formatDateYMD
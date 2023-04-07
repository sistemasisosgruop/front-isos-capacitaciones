const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

const formatDateDMY = (date) =>  {
  return [
    padTo2Digits(date.getDate()+ 1),
    padTo2Digits(date.getMonth() + 1),
    date.getFullYear(),
  ].join('/');
}
export default formatDateDMY
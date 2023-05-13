const showLoader = () => {
  document.getElementById('loader').classList.add('isActiveLoader');
}

const hideLoader = () => {
  document.getElementById('loader').classList.remove('isActiveLoader');
}
export {
  showLoader, hideLoader
}
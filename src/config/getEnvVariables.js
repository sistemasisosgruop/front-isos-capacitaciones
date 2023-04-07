
const getEnvVaribles = () => {

  const variablesEnv = import.meta.env;
  return {
    ...variablesEnv
  }

}
export default getEnvVaribles;
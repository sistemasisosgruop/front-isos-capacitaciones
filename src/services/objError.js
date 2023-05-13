const objErrorApi = (error) => {
  console.log("error :>> ", error);
  const { response } = error;
  if (response)
    return {
      status: response.status,
      data: null,
      message: response.data?.message
        ? response.data.message
        : "Ocurrio un error en el servidor",
    };
};
export default objErrorApi;

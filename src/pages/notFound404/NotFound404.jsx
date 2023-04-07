import svg404 from "../../assets/img/404.svg";

const NotFound404 = () => {
  return (
    <div className="w-3/5 mx-auto flex flex-col md:flex-row justify-center items-center h-screen">
      <div className="w-full md:w-1/2">
        <img src={svg404} />
      </div>
      <div className="w-full md:w-1/2 text-center">
        <h4 className="font-bold text-red-500 text-2xl">Error!</h4>
        no se pudo encontrar la pagina solicitada
        <p className="text-lg font-bold"></p>
      </div>
    </div>
  );
};

export default NotFound404;

import logoIndex from "../../assets/img/logoIndex.png";
import logoIsos from "../../assets/img/logoallincode.png";
import FormLogin from "./FormLogin";

const Index = () => {
  return (
    <div className="">
      <div className="flex items-center justify-center h-screen bg-slate-200">
        <div className="flex flex-col items-center md:flex-row">
          <div className="hidden md:block md:w-1/2">
            <img src={logoIndex} className="w-full" />
          </div>
          <div className="flex justify-center w-full md:w-1/2">
            <div className="w-full p-5 bg-white shadow-slate-300 md:w-3/5">
              <figure className="mb-3">
                <img src={logoIsos} className="mx-auto w-28" />
              </figure>
              <FormLogin />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

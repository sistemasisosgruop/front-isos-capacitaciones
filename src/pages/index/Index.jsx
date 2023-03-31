import { authAPi } from "../../services/auth";

import logoIndex from "../../assets/img/logoIndex.png";
import logoIsos from "../../assets/img/logoIsos.svg";
import FormLogin from "./FormLogin";
import { useQuery } from "@tanstack/react-query";



const Index = () => {
  console.log("render COMPONENTE");

/*   const { data } = useQuery({
    queryKey: ["auht"],
    queryFn: () => getToken(payload),
  }); */

  return (
    <div className="">
      <div className="flex justify-center items-center h-screen bg-slate-200">
        <div className="flex flex-col md:flex-row items-center">
          <div className="hidden md:block md:w-1/2">
            <img src={logoIndex} className="w-full" />
          </div>
          <div className="flex justify-center w-full md:w-1/2">
            <div className="shadow-slate-300 bg-white w-full md:w-3/5 p-5">
              <figure className="mb-3">
                <img src={logoIsos} className="w-28 mx-auto" />
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

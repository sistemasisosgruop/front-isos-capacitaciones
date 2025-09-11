
const SinRegistros = ({ text = "sin registros", classname = "bg-slate-100"}) => {
  return (
    <div className={`flex items-center justify-center w-full ${classname}`} style={{height:'60vh'}}>
      <h3 className='text-2xl font-bold'> { text }</h3>
    </div>
  )
}

export default SinRegistros

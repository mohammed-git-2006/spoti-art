
export default function Stepper(
  {totalSteps, currentStep, setStep} : 
  {totalSteps:number, currentStep:number, setStep: (v:number) => void})
{

  return (
    <div className="p-0 m-0 relative flex flex-col w-full lg:w-1/3 not-lg:w-4/5">
      <div className="relative w-full flex flex-row justify-between p-0 m-0">
        {new Array(totalSteps).fill(null).map((_, i) => {
          return <div className={"relative flex flex-row " + (i < totalSteps-1 ? 'flex-1 ' : '')}> 
            <div 
            onClick={() => {
              setStep(i)
            }}
            className={"cursor-pointer z-10 w-9 h-9 rounded-full flex items-center justify-center " +
              ((i-1 < currentStep ? 'bg-green-500' : 'bg-gray-600')) +
              ' transition delay-600'
            }>
              <span className="font-bold">{i+1}</span>
            </div>
            {i != totalSteps-1 && 
            <div className={"absolute w-full top-3.5 h-1.5 delay-100 left-0 transition "}>
              <span className="z-0 absolute w-full h-full bg-gray-400"></span>
              <span className={`left-0 z-5 origin-left absolute w-full duration-700 scale-x-${i<currentStep?100:0} transition delay-75 h-full bg-green-600`}></span>
              {/**+ (i < currentStep ? 'bg-green-500' : 'bg-gray-400') */}
            </div>}
          </div>
        })}
      </div>
    </div>
  )
}
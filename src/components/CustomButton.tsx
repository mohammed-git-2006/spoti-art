
export default function CustomButton({onClick} : {onClick:(e?:any) => void}) {
  return (<button
  onClick={onClick}
  className="rounded-full backdrop-blur-lg border-2 border-green-500 text-green-500 p-0
    text-sm p-4 transition hover:text-black relative
    aria-pressed:scale-110 group overflow-hidden active:scale-95 hover:scale-105"
  
  >
    <span className="absolute left-0 top-0 h-full w-full scale-x-0
      transition rounded-full ease-in-out duration-250
      group-hover:scale-x-100 z-0 origin-left 
    bg-green-500 inset-0">

    </span>
    <span className="z-999 relative">Continue  ›</span>
  </button>)
}
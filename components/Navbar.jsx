export default function Navbar(){
    return(
        <div className=" bg-black w-full fixed z-50 top-0 p-4 h-[4rem] flex justify-between " >
            <div className="bg-clip-text flex-1 text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold text-xl" >
                <a href="http://localhost:3000/">CrewConnect</a>
            </div>
        </div>
    );
}
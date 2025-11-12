
import {Button} from './Button';
function CardButton({label,onClick,color,placeholder,title}) {
        
    
    
    return(
           
            <section className='flex flex-col p-6 m-4 border rounded-lg shadow-lg w-full max-w-md'>
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                
                <input type="text" placeholder={placeholder} className="input border border-gray-300 rounded-md p-4 mb-4 shadow-md" />
                <Button label={label}  onClick={onClick} color={color} ></Button>
                    
                
                
                
                </section>

            

        );
}
export default CardButton;

import CardButton from "../../components/cardButton";
import {Button} from "../../components/Button";

function UserManagement() {
    const restPassword=()=>{
        console.log("Reset Password Clicked");
    }
    return (
       
        <main className="flex p-4">
           <CardButton label="Rest" onClick={restPassword} color="red" placeholder="search for user" title="Reset Password"/>
           

          

        </main>
        
    );
}

export default UserManagement;
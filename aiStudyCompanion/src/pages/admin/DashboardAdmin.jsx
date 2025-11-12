
import { Button } from "../../components/Button";
import {Dashboard} from "../../components/Dashboard";
import CardButton from "../../components/cardButton";

function DashboardAdmin() {
    
    
    const contentList= [{id:1011, author: "Abdullah", date: "new Date()", select: false },
        {id:1015, author: "Norah", date: "2023", select: false }
    ]

    //const [contentList, setContentList] = useState([]);
    // there should be a get method from the database to get the content panel
    const isClicked=(e) =>{
        const checkedContent = e.target.value 
        console.log(e.target.value);
    };


    return (
        
        <section className="flex flex-col  p-6 m-6 border rounded-lg shadow-lg w-full max-w-md">
            <h1 className="text-gray-900 font-bold m-2">
                Review Dashboard Component
                                                </h1>

        <table>
            <thead>
                <tr className="m-4 divide-y-1">
                    <th className="">Content ID</th>
                    <th className="">Creator</th>
                    <th className="">Date Created</th>
                    <th className="">Select</th>
                </tr>
            </thead>
            <tbody className="py-4 font-bold">
            
                
                {contentList.length > 0 && contentList.map((content) => {
                    return(
                    
                    <tr key={content.id} className=" ">

                        <td>{content.id}</td>
                        <td>{content.author}</td>
                        <td>{content.date}</td>
                        <td>
                            <input type="checkbox" onClick={isClicked} value={content.id}></input>
                            

                        </td>
                    </tr>

                    
                    )

                })} 
        </tbody>
        

           
        </table>
        <footer className="m-8">

        <input type="text" placeholder="Search for Content ID" className="mt-4 input border border-gray-300 rounded-md p-4 mb-4 shadow-md"></input>
        <Button label="Approve" onClick={isClicked} color="green" ></Button>

        </footer>

        </section>

        
    );
}
export default DashboardAdmin;
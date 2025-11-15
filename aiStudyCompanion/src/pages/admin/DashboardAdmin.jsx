
import { Button } from "../../components/Button";
import {Dashboard} from "../../components/Dashboard";
import CardButton from "../../components/cardButton";
import { useState } from "react";
import AuditLogs from "./Admincomponents/AuditLogs";
import ReviewComponent from "./Admincomponents/ReviewComponent";


function DashboardAdmin() {
    
    
    const contentList= [{id:1011, author: "Abdullah", date: "new Date()", select: false },
        {id:1015, author: "Norah", date: "2023", select: false }
    ]

    const [selected,setSelectedElements] = useState([])

    //const [contentList, setContentList] = useState([]);
    // there should be a get method from the database to get the content panel
    const isClicked=(e) =>{
        const checkedContent = e.target.value 
        setSelectedElements([...selected,checkedContent]);
        console.log(selected)
        console.log(e.target.value);
    };

    // there should be a method to remove content


    const validateID= (e) => {
        console.log(e.target.value)
    };

    return (
        <section className="sm:grid  lg:flex flex-row justify-center ">
        <ReviewComponent/>

        <AuditLogs/>

                </section>
        

        
    );
}
export default DashboardAdmin;
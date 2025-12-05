

import { Button } from "../../../components/Button";

import { useState } from "react";







function ReviewComponent(){
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
    
    return(
        <section className=" flex flex-col  p-6 m-6 border rounded-lg shadow-lg w-full max-w-md">
                    <h1 className="relative text-gray-900 font-bold m-4 p-2 mt-0">
                        Review Dashboard Component
                                                        </h1>
        
                <table>
                    <thead>
                        <tr className="m-4 border-b">
                            <th className="">Content ID</th>
                            <th className="">Creator</th>
                            <th className="">Date Created</th>
                            <th className="">Select</th>
                        </tr>
                    </thead>
                    <tbody className="py-8 ">
                    
                        
                        {contentList.length > 0 && contentList.map((content) => {
                            return(
                            
                            <tr key={content.id} className="m-4 py-4 border-b">
        
                                <td className="py-4">{content.id}</td>
                                <td className="py-4">{content.author}</td>
                                <td className="py-4">{content.date}</td>
                                <td className="py-4">
                                    <input type="checkbox" onClick={isClicked} value={content.id} ></input>
                                    
        
                                </td>
                            </tr>
        
                            
                            )
        
                        })} 
                </tbody>
                
        
                   
                </table>
                <footer className="  m-4 flex flex-col justifiy-around">
                    
        
                <input type="text" name="text" placeholder="Search for Content ID"  onChange={validateID} className="mt-4 input border  border-gray-300 rounded-md p-4 mb-4 mr-8 shadow-md"></input>
                <Button label="Approve" onClick={isClicked} color="green" ></Button>
                <Button label="Remove" onClick={isClicked} color="red" ></Button>
        
                </footer>
        
                </section>

    )

}

export default ReviewComponent;
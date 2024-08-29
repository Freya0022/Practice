import { useParams } from "react-router-dom";


const Household = () => {
    const {household} = useParams<{household: string}>(); 

  return (
    <div>
        <h1>{household}</h1>
    </div>  )
}

export default Household
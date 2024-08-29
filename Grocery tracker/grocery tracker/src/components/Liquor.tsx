import { useParams } from "react-router-dom";


const Liquor = () => {
    const {liquor} = useParams<{liquor: string}>(); 
  return (
    <div>
        <h1>{liquor}</h1>
    </div>
  )
}

export default Liquor
import { useParams } from "react-router-dom";

const Pantry = () => {
    const {pantry} = useParams<{pantry: string}>(); 

  return (
    <div>
        <h1>{pantry}</h1>
    </div>
  )
}

export default Pantry
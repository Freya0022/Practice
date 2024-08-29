import { useParams } from "react-router-dom";


const Frozen = () => {
    const {frozen} = useParams<{frozen: string}>(); 

  return (
    <div>
        <h1>{frozen}</h1>
    </div>
  )
}

export default Frozen
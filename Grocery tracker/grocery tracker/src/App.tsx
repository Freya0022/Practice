import ListGroup from "./components/ListGroup";
import { BrowserRouter as Router,Route,Routes } from "react-router-dom";
import Drink from "./components/Drink";
import Frozen from "./components/Frozen";
import Household from "./components/Household";
import Liquor from "./components/Liquor";
import Pantry from "./components/Pantry";

function App() {
  let items = [
    "Drink",
    "Frozen",
    "Liquor",
    "Household",
    "Pantry"
];

const handleSelectItem = (item:string) => {
  console.log(item);
}
  return (

  <Router>
      <Routes>
        <Route path="/" element={<ListGroup items={items} heading="Tracker" onSelectItem={handleSelectItem}/>}/>
        <Route path="/Drink/:drink" element={<Drink />} />
        <Route path="/Frozen/:frozen" element={<Frozen />} />
        <Route path="/Household/:household" element={<Household />} />
        <Route path="/Liquor/:liquor" element={<Liquor />} />
        <Route path="/Pantry/:pantry" element={<Pantry />} />
      </Routes>
    </Router>
);
}

export default App;
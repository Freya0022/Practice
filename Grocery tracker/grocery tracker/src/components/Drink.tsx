import { useState } from "react";
import { useParams } from "react-router-dom";

interface Product {
    id: number,
    name: string,
    bestBefore: string
}

const Drink = () => {
    const {drink} = useParams<{drink: string}>(); 

    const [products, setProducts] = useState<Product[]>([
        {id: 1, name:"Cola", bestBefore:"2025-02-01"},
        {id: 2, name:"Pepsi", bestBefore:"2025-03-01"},
        {id: 3, name:"Fenta", bestBefore:"2025-04-01"},
    ]);

    const [newProductName, setNewProductName] = useState("");
    const [newProductDate, setNewProductDate] = useState("");

    const calculateRemainingDate = (bestBefore: string) => {
        const bestBeforeDate = new Date(bestBefore);
        const currentDate = new Date();
        const timeDiff = bestBeforeDate.getTime() - currentDate.getTime();
        const daysRemaining = Math.floor(timeDiff/(1000*3600*24));

        if (daysRemaining > 30)
        {
            const monthsRemaining = Math.floor(daysRemaining/30);
            return `${monthsRemaining} months`
        } else{
            return `${daysRemaining} days`;
        }
        
    }

    const handleAddProduct = () => {
        if(newProductName && newProductDate){
            const newProduct = {
                id: products.length + 1,
                name: newProductName,
                bestBefore: newProductDate
            };
            setProducts([...products, newProduct]);
            setNewProductName("");
            setNewProductDate("");
        }
    }

  return (
    <div>
        <h1>{drink}</h1>
        <table className="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Product Name</th>
      <th scope="col">Best before</th>
      <th scope="col">Remain</th>
    </tr>
  </thead>
  <tbody>
    {products.map((product) => (
        <tr key={product.id}>
        <th scope="row">{product.id}</th>
        <td>{product.name}</td>
        <td>{product.bestBefore}</td>
        <td>{calculateRemainingDate(product.bestBefore)}</td>
      </tr>
    ))}
  </tbody>
</table>
<div className="mt-4">
        <h3>Add a New Product</h3>
        <div className="col-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Product Name"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
          />
        </div>
        </div>
        <div className="col-4">
        <div className="mb-3">
          <input
            type="date"
            className="form-control"
            placeholder="Best Before Date"
            value={newProductDate}
            onChange={(e) => setNewProductDate(e.target.value)}
          />
        </div>
        </div>
        <button className="btn btn-primary" onClick={handleAddProduct}>
          Add Product
        </button>
    </div>
    </div>
    
  )
}

export default Drink
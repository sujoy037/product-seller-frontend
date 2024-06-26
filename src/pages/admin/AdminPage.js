import React, { useState, useEffect, useRef } from 'react'
import ProductService from '../../service/product.service'
import { ProductSave } from '../../components/product.save';
import Product from '../../model/Product';


const AdminPage = () => {
  const [productList, setProductList] = useState([])

  const [selectedProduct, setSelectedProduct] = useState(new Product('', '', 0));
  const [errorMessage, setErrorMessage] = useState('')

  const saveComponent = useRef()


  useEffect(() => {
    ProductService.getAllProducts().then((response) => {
      setProductList(response.data);

    });
  }, []);

  const creatProductRequest = () => {
    setSelectedProduct(new Product('','',0))
    saveComponent.current?.showProductModal()
  }

  const saveProductWatcher=(product)=>{

    let itemIndex = productList.findIndex(item => item.id === product.id);
    if (itemIndex !== -1) {
      const newList = productList.map((item) => {
          if (item.id === product.id) {
              return product;
          }
          return item;
      });
      setProductList(newList);
  } else {
      const newList = productList.concat(product);
      setProductList(newList);
  }


    // const newList=productList.concat(product)
    // setProductList(newList)
  }

  const editProductRequest=(item)=>{
    setSelectedProduct(Object.assign({},item))
    saveComponent.current?.showProductModal()
    

  }

  const deleteProduct = (item) => {
    ProductService.deleteProduct(item).then(_=>{
      setProductList(productList.filter(x=>x.id!==item.id))
    }).catch(err=>{
      setErrorMessage('Unexpected error occure')
      console.log(err)
    })
  };
  return (
    <div>
      <div className="container">
        <div className="pt-5">
        {errorMessage &&
          <div className="alert alert-danger">
              {errorMessage}
          </div>
          }
          <div className="card">
            <div className="card-header">
              <div className="row">
                <div className="col-6">
                  <h3>All Products</h3>
                </div>
                <div className="col-6 text-end">
                  <button className="btn btn-primary" onClick={() => creatProductRequest()}>
                    Create Product
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Date</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item, ind) =>
                    <tr key={item.id}>
                      <th scope="row">{ind + 1}</th>
                      <td>{item.name}</td>
                      <td>{`$ ${item.price}`}</td>
                      <td>{new Date(item.createTime).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-primary me-1" onClick={()=>editProductRequest(item)}>
                          Edit
                        </button>
                        <button className="btn btn-danger" onClick={() => deleteProduct(item)} >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ProductSave ref={saveComponent} product={selectedProduct} onSaved={(p) => saveProductWatcher(p)}/>
    </div>
  )
}

export default AdminPage
class ProductManager {
    constructor() {
        this.products = [];
    }

    static id = 0;
}    

    addProduct(title, description, price, image, code, stock); {
        for (let i = 0; i < this.products.length; i++) {
            if(this.products[i].code === code){
                console.log('el codigo ${code} esta repetido');
                break;
            }
        } 
        const newProduct ={
            title,
            description,
            price,
            image,
            code,
            stock,
        }

       if(!Object.values(newProduct).includes(undefined)){
        ProductManager.id++;
        this.products.push({
            ...newProduct,
            id: ProductManager.id, 
        });
       } else{
        console.log('todos los campos son requeridos')
       }

    }


getProduct(); {
    return this.products;
}

existe (id); {
    return this.product.find((producto) => producto.id === id)
}

getProductById(id);{
 !this.existe(id) ? console.log('Not Found') : console.log(this.existe(id));
 }


 const productos = new ProductManager

 productos.addProduct('titulo1','descripcion1', '1000', 'imagen1', 'abc123', '5')
 productos.addProduct('titulo2','descripcion2', '1002', 'imagen2', 'abc124', '6')
 console.log(productos.getProduct())

productos.getProductById(2)

const Contenedor = require ('Archivos.js');

const products = new Contenedor('productos.txt');

const test = async () => {
    let  save = await products.save({
        title: 'Nico',
        price: 12345,
        thumbnail: 'https:asaaa123'
    });
    let getAll = await products.getAll();
    let getById = await products.getById(5);
    let deleteById = await products.deleteById(2);
    let deleteAll = await products.deleteAll
    console.log(save); 
    console.log(getAll); 
    console.log(getById); 
    console.log(deleteById); 
    console.log(deleteAll); 
};

test(); 
const { Router } = require("express");
const mongoose = require("mongoose");
const Cart = require("../../models/Carts.model");
const Products = require("../../models/Products.model");
const userAcces = require("../../middlewares/userAccess.middleware");
const cartsDao = require("../carts.dao");
const ticketsDao = require("../tickets.dao");
const uuid = require("uuid");
const ErrorRepository = require("../repositories/errors.repository");
const logger = require("../../config/logger.config");
const router = Router();

router.post("/", userAcces, async (req, res, next) => {
  try {
    const newCart = await Cart.create({});
    logger.info("Nuevo carrito creado!", newCart);
    res.status(200).json(newCart);
  } catch (error) {
    logger.error("Error al crear el carrito.", error);
    next(error);
  }
});

router.get("/:cid", userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate(
      "productos.product"
    );
    res.status(200).render("carts.handlebars", { cart });
    logger.info("Se mostro el carrito: ", { cartId: req.params.cid });
  } catch (error) {
    logger.error("Error al cargar el carrito", error);
    console.log(error);
    next(new ErrorRepository("Error al mostrar el carrito", 400));
  }
});

router.post("/:cartId/:productId", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cartId });
    const product = await Products.findOne({ _id: req.params.productId });

    await cartsDao.saveProduct(cart, product);

    logger.info("Producto agregado con exito!");
    res.status(200).json("se agrego el producto con exito");
  } catch (error) {
    logger.error("Error al agregar el producto", error);
    next(error);
  }
});

router.put("/:cid", userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = req.body.productos;

    await cart.save();

    res.status(200).json({ message: "Carrito actualizado", cart });
    logger.info("Carrito actualizado con exito!", cart);
  } catch (error) {
    logger.error("Error al actualizar el carrito", error);
    next(error);
  }
});

router.put("/:cid/products/:pid", userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    const item = cart.productos.find((item) => item.product == req.params.pid);
    if (!item) throw new Error("Producto no encontrado en el carrito");
    item.quantity = req.body.quantity;
    await cart.save();
    res.status(200).json({ message: "Carrito actualizado", cart });
    logger.info("Cantidad de producto actualizada.", cart);
  } catch (error) {
    logger.error("Error al actualizar la propiedad del producto.", error);
    next(error);
  }
});

router.post("/:cid/products/:pid", userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.cid });
    const productIndex = cart.productos.findIndex((item) =>
      item.product.equals(new mongoose.Types.ObjectId(req.params.pid))
    );
    if (productIndex === -1)
      throw new Error("Producto no encontrado en el carrito");
    cart.productos.splice(productIndex, 1);
    await cart.save();
    logger.info("Producto eliminado con exito.", cart);
    res.status(200).json("Se elimino el producto con exito");
  } catch (error) {
    logger.error("Error al eliminar el producto.", error);
    next(error);
  }
});

router.delete("/:cid", userAcces, async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.productos = [];
    await cart.save();
    logger.info("Productos eliminados con exito.", cart);
    res.status(200).json({
      message: "Todos los productos fueron removidos del carrito",
      cart,
    });
  } catch (error) {
    logger.error("Error al eliminar los productos del carrito.", error);
    next(error);
  }
});

router.get("/:cid/purchase", userAcces, async (req, res, next) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId);
    const userEmail = req.user.email;
    const code = uuid.v4();

    const purchaseData = await ticketsDao.processDataTicket(
      code,
      userEmail,
      cart
    );

    const ticket = purchaseData.ticket;
    const unprocessedProducts = purchaseData.unprocessedProducts;

    if (unprocessedProducts.length > 0) {
      res.json({
        "Productos sin stock": unprocessedProducts,
        "Ticket de compra": ticket,
      });
    } else {
      res.json({ "Gracias por tu compra": ticket });
    }

    logger.info("Compra exitosa", ticket);
  } catch (error) {
    logger.error("Error al procesar compra, revisa los datos.", error);
    next(error);
  }
});

module.exports = router;

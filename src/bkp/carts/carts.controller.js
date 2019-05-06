/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Cart controller.
 */

// --------------- Module Imports
import Cart from './cart.model'

import CartItem from './cart-item.model'
import Product from '../products/product.model'
import ProductCategory from '../product-categories/product-category.model'

// --------------- Module Controller
const CartsCtrl = {
  create: async cartInfo => Cart.create(cartInfo), // Returns created cart
  get: async id => CartsCtrl.getCart({ _id: id }), // Get given cart and information
  clear: async id => {
    await CartItem.remove({ ownerId: id }) // Removes all the cart items for the given card
    await Cart.findOneAndUpdate({ _id: id }, { items: [] }) // Sets an empty items list on the cart
    return CartsCtrl.getCart({ _id: id }) // Gets the cart and its information
  },

  getCategoryItems: async (id, category) => {
    const parsedCategory = await ProductCategory.findOne({ slug: category }, 'description') // Gets the category info
    const items = await Product.find({
      status: 'active',
      fullCategoriesList: { $in: [parsedCategory._id] }
    }) // Gets the items
      .lean()
      .distinct('_id') // As an array of _ids
    const cart = await CartItem.find({
      // Finds the cart items
      ownerId: id, // For the given cart
      information: { $in: items } // Within the given category
    }).populate('information') // Retrieving the information field
    return { description: parsedCategory.description, items: cart } // Returns the cart items
  },

  getCart: async criteria => {
    let cart = await Cart.findOne(criteria).lean() // Gets the cart basic info
    if (!cart) cart = await Cart.create() // In case the cart is not found, creates it
    let items = await CartItem.find({ _id: { $in: cart.items } })
      .populate('information inventoryRef promotionRef')
      .lean() // Gets cart items
    let total = 0 // Intializes cart total amount
    items = await Promise.all(
      await items.map(async item => {
        // Iterate over itens
        item.price = item.inventoryRef.price // For every item price:
        item.discountPrice = item.promotionRef ? item.promotionRef.discountPrice : undefined // Checks if the item has a discount
        total += item.quantity * (item.discountPrice || item.price) // Multiplies it with the quantity and sums it to the total
        return item // Returns the item to the list
      })
    )
    cart = await Cart.findOneAndUpdate(criteria, { total }, { new: true })
      .populate('merchant')
      .lean() // Updates the total value
    return Object.assign(cart, { items }) // Returns the cart with the items
  },

  formatItem: async (item, cartId, increment) => {
    const cart = await Cart.findOne({ _id: cartId }).lean() // Gets the cart basic information
    delete item.__v // Prevents version overriding
    item.isNew = !item.quantity // Checks if the item must be created
    if (item.isNew) {
      // In case it is a new item
      item.information = item.information._id // Preserves the catalogue reference
      item.isPromotional = item.discountPrice > 0 // Checks if the item is on promotion
      if (item.isPromotional) {
        // In case the item is on promotion
        item.promotionRef = item._id // Preserve the promotion item reference
        item.inventoryRef = item.inventoryRef // Preserve the inventory item reference
      } else {
        // In case it is not on promotion
        item.inventoryRef = item._id // Preserve the inventory item reference
      }
      item.ownerId = cart._id // Item belongs to the specified cart
      if (!item.isDuplicated) delete item._id // In case the item is not duplicated, create it
      item.parentType = 'Cart' // Converts the item into an cart item
    }
    const updatedQuantity = increment ? ++item.quantity : --item.quantity
    item.quantity = item.quantity ? updatedQuantity : 1 // Sets the proper item quantity
    item.mustDelete = !(item.quantity > 0) // Checks if item has to be removed from the cart (quatity lesser than one)
    return item // Returns item
  },

  incrementItem: async (id, item) => {
    const cart = await Cart.findOne({ _id: id }).lean() // Gets the cart information
    cart.items = cart.items || [] // Simulates items if not needed
    const itemInfo = await CartsCtrl.formatItem(item, cart._id, true) // Gets the item information
    await CartItem.findOneAndUpdate(
      { ownerId: id, information: itemInfo.information },
      { $set: itemInfo },
      { new: true, upsert: true }
    ).populate('information inventoryRef promotionRef') // Saves the item
    const updated = await CartsCtrl.getCart({ _id: cart._id }) // Gets the updated card with all the required infroamtion
    return updated // Returns the cart
  },

  decrementItem: async (id, item) => {
    const itemInfo = await CartsCtrl.formatItem(item, id) // Formats item information
    if (itemInfo.mustDelete)
      await Cart.findOneAndUpdate({ _id: id }, { $pull: { items: item._id } }, { new: true })
    // In case the item has quantity below one, deletes it
    else await CartItem.findOneAndUpdate({ _id: item._id }, { $set: itemInfo }, { new: true }) // Otherwise, updates the item
    if (itemInfo.mustDelete) await CartItem.remove({ _id: item._id }) // Deletes the item if needed
    const cart = await CartsCtrl.getCart({ _id: id }) // Gets the updated cart with items and information
    return cart // Returns the cart
  }
}
export default CartsCtrl

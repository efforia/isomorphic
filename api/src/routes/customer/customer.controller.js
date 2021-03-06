/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Customer controller.
 */

// --------------- Module Imports
import Customer from './customer.model'

// --------------- Module Controller
const CustomersCtrl = {
  addFavorite: async (user, merchant) => {
    const favorites = (await Customer.findOneAndUpdate(
      { _id: user._id },
      { $addToSet: { favoriteMerchants: merchant } },
      { upsert: true, new: true }
    ) // Adds it to the favorites list
      .populate('favoriteMerchants')).favoriteMerchants // Populates the favorites list
    return favorites // Returns the updated list
  },
  removeFavorite: async (user, merchant) => {
    const favorites = (await Customer.findOneAndUpdate(
      { _id: user._id },
      { $pull: { favoriteMerchants: merchant } },
      { new: true }
    ) // Adds it to the favorites list
      .populate('favoriteMerchants')).favoriteMerchants // Populates the favorites list
    return favorites // Returns the updated list
  },
  getFavorites: async (user) => {
    const favorites = (await Customer.findOne({ _id: user._id })).favoriteMerchants // Gets the favorites list
    return favorites // Returns the list
  }
}
export default CustomersCtrl

/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item controller.
 */

// --------------- Module Imports
import Product from './product.model'

import SeoService from '../../../services/seo.service'
import ProductCategories from '../product-categories/product-categories.controller'

const ProductsCtrl = {
  save: async (user, item) => {
    let formattedItem = ProductsCtrl.format(user, item) // Formats market item date
    const itemByName = await Product.findOne({ name: formattedItem.name }) // Checks if the product name is already taken
    if (itemByName && formattedItem.isNewItem)
      throw new Error('This product name has already been taken )') // If it is, prevents duplications
    delete formattedItem.createdAt // Removes timestamps in order to prevent conflicts
    delete formattedItem.updatedAt // Removes timestamps in order to prevent conflicts
    delete formattedItem.__v // Removes versioning in order to prevent conflicts
    formattedItem = formattedItem.isNewItem
      ? await new Product(item).save()
      : await Product.findOneAndUpdate({ _id: formattedItem._id }, { $set: item }) // Otherwise, creates or updates it accordingly
    if (formattedItem.status !== 'pending') {
      // In case the item is await for approval
      const categories = await ProductCategories.getAllCategoriesForItem(formattedItem._id) // Gets all the item categories and parent categories
      formattedItem = await Product.findOneAndUpdate(
        { _id: formattedItem._id },
        { fullCategoriesList: categories }
      ).populate('attributes.label categories rootCategories') // Sets the proper categories for the item
    }
    return item // Returns the saved item
  },
  format: (user, item) => {
    item.isNewItem = !item._id // Checks if this is a new item
    if (item.isNewItem) {
      // In case it is
      const isAdmin = user.role === 'ADMIN' // Checks the user admin
      item.status = isAdmin ? 'active' : 'pending' // In case it is not admin, enqueue it for approval
      item.submittedBy = user._id // Defines who submitted the market item
    }
    item.slug = SeoService.getSlugFrom(item.name) // Sets the slug for the item SEO
    return item // Returns the formatted item
  },
  get: async id =>
    Product.findOneWithDeleted({ _id: id }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ), // Gets the item and its related information by the provided _id
  getBySlug: async slug =>
    Product.findOneWithDeleted({ slug }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ), // Gets the item and its related information by the provided slug
  accept: async id =>
    Product.findOneAndUpdate({ _id: id }, { status: 'active' }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ), // Updates item status to accepted
  reject: async id =>
    Product.findOneAndUpdate({ _id: id }, { status: 'rejected' }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ), // Updates item status to rejected
  deactivate: async id => {
    const item = await Product.findOneWithDeleted({ _id: id }) // Gets the item by _id
    await item.delete() // Deactivates the item
    return item // Returns the deactivated item
  },
  activate: async id => {
    const item = await Product.findOneWithDeleted({ _id: id }) // Gets the item by _id
    await item.restore() // Ativates the item
    return item // Returns the activated item
  },
  listPending: async () =>
    Product.find({ status: 'pending' }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ), // List all the items with the pending status
  listByCategory: async (user, slug, exclude, paginate, page, pageSize) => {
    const category = await ProductCategories.getBySlug(user, slug) // Gets the category information
    const isAdmin = user && user.role === 'ADMIN' // Checks if the user is an admin
    const operation = isAdmin ? 'findWithDeleted' : 'find' // In case it is, include deactivated items on the list
    const byCriteria = {
      _id: { $nin: exclude },
      status: 'active',
      fullCategoriesList: { $elemMatch: { $in: [category._id] } }
    } // Define criteria for items query based on the given category
    const catalogueQuery = Product[operation](byCriteria)
    if (paginate) catalogueQuery.limit(pageSize).skip(page * pageSize)
    catalogueQuery.sort({ name: 1 }).populate('categories')
    let items = await catalogueQuery.exec() // Filters the items
    items = items.map(item => ({ _id: item._id, information: item })) // Formats the items
    const totalCount = isAdmin
      ? await Product.countWithDeleted(byCriteria)
      : await Product.count(byCriteria) // Retrieves the total items count for the given criteria
    return category && items ? { description: category.description, items, totalCount } : {} // Returns the category items
  }
}
export default ProductsCtrl

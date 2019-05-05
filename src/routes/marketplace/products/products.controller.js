/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item controller.
 */

// --------------- Module Imports
import Product from './product.model'

import SeoService from '../../../services/seo.service'
import ProductCategory from '../product-categories/product-category.model'
import ProductCategories from '../product-categories/product-categories.controller'

const ProductsCtrl = {
  save: async (user, item) => {
    item = ProductsCtrl.format(user, item) // Formats market item date
    let itemByName = await Product.findOne({ name: item.name }) // Checks if the product name is already taken
    if (itemByName && item.isNewItem) throw new Error('This product name has already been taken )') // If it is, prevents duplications
    delete item.createdAt // Removes timestamps in order to prevent conflicts
    delete item.updatedAt // Removes timestamps in order to prevent conflicts
    delete item.__v // Removes versioning in order to prevent conflicts
    item = item.isNewItem
      ? await new Product(item).save()
      : await Product.findOneAndUpdate({ _id: item._id }, { $set: item }) // Otherwise, creates or updates it accordingly
    if (item.status !== 'pending') {
      // In case the item is await for approval
      let categories = await ProductCategories.getAllCategoriesForItem(item._id) // Gets all the item categories and parent categories
      item = await Product.findOneAndUpdate(
        { _id: item._id },
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
  get: async id => {
    return Product.findOneWithDeleted({ _id: id }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ) // Gets the item and its related information by the provided _id
  },
  getBySlug: async slug => {
    return Product.findOneWithDeleted({ slug }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ) // Gets the item and its related information by the provided slug
  },
  accept: async id => {
    return Product.findOneAndUpdate({ _id: id }, { status: 'active' }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ) // Updates item status to accepted
  },
  reject: async id => {
    return Product.findOneAndUpdate({ _id: id }, { status: 'rejected' }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ) // Updates item status to rejected
  },
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
  listPending: async () => {
    return Product.find({ status: 'pending' }).populate(
      'pictures submittedBy attributes.label categories fullCategoriesList rootCategories'
    ) // List all the items with the pending status
  },
  listByCategory: async (user, slug, exclude, paginate, page, pageSize) => {
    let category = await ProductCategories.getBySlug(user, slug) // Gets the category information
    let isAdmin = user && user.role == 'ADMIN' // Checks if the user is an admin
    let operation = isAdmin ? 'findWithDeleted' : 'find' // In case it is, include deactivated items on the list
    let byCriteria = {
      _id: { $nin: exclude },
      status: 'active',
      fullCategoriesList: { $elemMatch: { $in: [category._id] } }
    } // Define criteria for items query based on the given category
    let catalogueQuery = Product[operation](byCriteria)
    if (paginate) catalogueQuery.limit(pageSize).skip(page * pageSize)
    catalogueQuery.sort({ name: 1 }).populate('categories')
    let items = await catalogueQuery.exec() // Filters the items
    items = items.map(item => {
      return { _id: item._id, information: item }
    }) // Formats the items
    let totalCount = isAdmin
      ? await Product.countWithDeleted(byCriteria)
      : await Product.count(byCriteria) // Retrieves the total items count for the given criteria
    return category && items
      ? { description: category.description, items: items, totalCount: totalCount }
      : {} // Returns the category items
  }
}
export default ProductsCtrl

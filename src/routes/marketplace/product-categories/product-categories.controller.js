/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item category controller.
 */

// --------------- Module Imports
import ProductCategory from './product-category.model'

import Product from '../products/product.model'
import SeoService from '../../../services/seo.service'

// --------------- Module Controller
const ProductCategoriesCtrl = {
  save: async categoryInfo => {
    categoryInfo.isRoot = !categoryInfo.parent // Checks if it is root
    const category = categoryInfo._id
      ? await ProductCategory.findOneAndUpdate({ _id: categoryInfo._id }, { $set: categoryInfo })
      : await ProductCategory.create(categoryInfo) // Creates or updates the category
    const slug = await ProductCategoriesCtrl.getSlug(category._id) // Gets the updated category slug
    await ProductCategory.findOneAndUpdate({ _id: category._id }, { slug }) // Sets it on the categoryInfobase
    if (categoryInfo.parent)
      await ProductCategory.findOneAndUpdate(
        { _id: categoryInfo.parent },
        { $addToSet: { children: category._id } }
      ) // Updates the parent category accordingly
    return category // Returns the saved category
  },

  list: async user => {
    const withDeleted = ProductCategoriesCtrl.withDeleted(user) // Gets the categories including the deleted ones
    return ProductCategory.findWithDeleted(withDeleted, 'description slug children deleted', {
      sort: { description: 1 }
    }).populate('children') // Retrieves the categories information
  },

  listRoot: async user => {
    const withDeleted = ProductCategoriesCtrl.withDeleted(user) // Gets the root categories including the deleted ones
    return ProductCategory.findWithDeleted(
      Object.assign({ parent: { $exists: false } }, withDeleted),
      'description slug children deleted',
      { sort: { description: 1 } }
    ).populate('children') // Retrieves the categories information
  },

  getBySlug: async (user, slug) => {
    const withDeleted = ProductCategoriesCtrl.withDeleted(user) // Gets the categories including the deleted ones
    const category = await ProductCategory.findOneWithDeleted({ slug }).lean() // Gets the category information
    if (category)
      category.children = await ProductCategory.findWithDeleted(
        Object.assign({ _id: { $in: category.children } }, withDeleted)
      ).lean() // Populates children category information
    category.children.sort((a, b) => a.description ? a.description.localeCompare(b.description) : 0) // Sorts the children categories alphabetically
    return category // Returns the category information
  },

  deactivate: async id => {
    const category = await ProductCategory.findOneWithDeleted({ _id: id }) // Gets the category
    await category.delete() // Deactivates it
    return category // Returns the deactivates category
  },

  activate: async id => {
    const category = await ProductCategory.findOneWithDeleted({ _id: id }) // Gets the category
    await category.restore() // Activates it
    return category // Returns the activated category
  },

  getSlug: async categoryId => new Promise((resolve, reject) => {
      ProductCategoriesCtrl.getParentsFor(categoryId, (error, parents) => {
        // Gets all the parent levels categories for the categoy
        if (error) return reject(error) // In case of error, returns it
        const reversed = parents.reverse() // Sets the proper parent order (root > parent > parent > ... > child)
        let categoryPath = '' // Initializes catgory path (parent-category-child-category)
        reversed.forEach((parent, index) => {
          // For every category parent
          categoryPath += parent.description // Adds the category parent
          if (index !== reversed.length - 1) categoryPath += '-' // Followed by a dash
        })
        const slug = SeoService.getSlugFrom(categoryPath.toLowerCase().replace(/\//g, '-')) // Sluggify the category path
        resolve(slug) // Returns the slug
      })
    }),

  getParentsFor: async (categoryId, callback) => {
    const getParentsFor = (childCategoryId, categories, recursiveCallback) => {
      // Gets parents of all leves for given category
      ProductCategory.findOne(
        { _id: childCategoryId },
        'parent description isRoot _id',
        (error, category) => {
          // Retrieves the given category information
          if (error) return recursiveCallback(error) // In case of error, returns it
          if (category) categories.push(category) // Adds parent to the list list
          return !category || category.isRoot
            ? recursiveCallback(undefined, categories)
            : getParentsFor(category.parent, categories, recursiveCallback) // So, that's a recursive loop
        }
      )
    }
    getParentsFor(categoryId, [], callback) // Starts the recursive loop
  },

  getAllCategoriesForItem: async id => new Promise(async (resolve, reject) => {
      const item = await Product.findOne({ _id: id }, 'categories -_id') // Gets the item and information
      const itemCategories = item.categories || [] // Initializes item categories array
      const currentCategory = 0 // Initializes iterated categories counter
      const lastCategory = itemCategories.length // Stop condition for the loop
      let categories = [] // Initializes parsed categories array
      itemCategories.forEach(async (categoryId) => {
        // For every item category
        this.getParentsFor(categoryId, (error, parents) => {
          // Gets the multilevel parent categories
          if (error) return reject(error) // In case of errors, returns them
          if (parents && parents.length) {
            // In case there are any parents
            parents.filter(category => categories.indexOfObject('_id', category._id) === -1) // Checks if the parent does not exists on the list
            categories = categories.concat(parents) // Adds the new parents found
          }
          if (currentCategory + 1 === lastCategory) {
            // In case the loop ended
            resolve(categories) // Returns the results
          }
        })
      })
    }),

  getCategoriesForItems: async items => new Promise(async (resolve) => {
      // Gets all the levels of categories for given items list
      let categories =
        (await Product.aggregate([
          { $match: { _id: { $in: items } } }, // For the given items
          { $unwind: '$fullCategoriesList' }, // Retrieve the full categories list
          { $group: { _id: '$fullCategoriesList' } } // As unique category ids
        ])) || []
      categories = categories.map(category => `${category._id  }`) // Reduces the categories results to an array of ids
      resolve(categories) // Returns the results
    }),

  withDeleted: user => 
     user && user.role === 'ADMIN' ? {} : { deleted: false } // Checks if the queries must return deactivates items or not
  
}

/*     getItemsForCategoryAsAdmin: async  (category) => {
        let categorySlug = category // Gets category slug
        let category = await ProductCategory.findOne({ slug: categorySlug }) // Gets category information
        let items = (await Product.findWithDeleted({ // Retrieves all items for the category (including the deleted ones)
            status: "active", // As long as it is active
            fullCategoriesList: { $elemMatch: { $in: [category._id] } } // And inside the category
        }).populate('categories')).map((Product) => { // Then formats the item
            return { // Since the inventory. promotion and cart items have an information field
                _id: Product._id, // We set the catalogue item _id
                information: Product // And add the informaiton field in order to keep compatibility
            }
        })
       return category && items ? { description: category.description, items: items } : {} // Finally, returns the results
    }, */
export default ProductCategoriesCtrl

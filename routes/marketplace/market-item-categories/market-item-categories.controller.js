/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item category controller.
 */

// --------------- Module Imports
const MarketItemCategory = require('./market-item-category.model')
const MarketItem = require('../market-items/market-item.model')
const SeoService = require('../../../services/seo.service')

// --------------- Module Controller
const MarketItemCategoriesCtrl = (module.exports = {
  save: async function(categoryInfo) {
    categoryInfo.isRoot = !categoryInfo.parent // Checks if it is root
    let category = categoryInfo._id
      ? await MarketItemCategory.findOneAndUpdate({ _id: categoryInfo._id }, { $set: categoryInfo })
      : await MarketItemCategory.create(categoryInfo) // Creates or updates the category
    let slug = await MarketItemCategoriesCtrl.getSlug(category._id) // Gets the updated category slug
    await MarketItemCategory.findOneAndUpdate({ _id: category._id }, { slug: slug }) // Sets it on the categoryInfobase
    if (categoryInfo.parent)
      await MarketItemCategory.findOneAndUpdate(
        { _id: categoryInfo.parent },
        { $addToSet: { children: category._id } }
      ) // Updates the parent category accordingly
    return category // Returns the saved category
  },

  list: async function(user) {
    let withDeleted = MarketItemCategoriesCtrl.withDeleted(user) // Gets the categories including the deleted ones
    return await MarketItemCategory.findWithDeleted(
      withDeleted,
      'description slug children deleted',
      { sort: { description: 1 } }
    ).populate('children') // Retrieves the categories information
  },

  listRoot: async function(user) {
    let withDeleted = MarketItemCategoriesCtrl.withDeleted(user) // Gets the root categories including the deleted ones
    return await MarketItemCategory.findWithDeleted(
      Object.assign({ parent: { $exists: false } }, withDeleted),
      'description slug children deleted',
      { sort: { description: 1 } }
    ).populate('children') // Retrieves the categories information
  },

  getBySlug: async function(user, slug) {
    let withDeleted = MarketItemCategoriesCtrl.withDeleted(user) // Gets the categories including the deleted ones
    let category = await MarketItemCategory.findOneWithDeleted({ slug: slug }).lean() // Gets the category information
    if (category)
      category.children = await MarketItemCategory.findWithDeleted(
        Object.assign({ _id: { $in: category.children } }, withDeleted)
      ).lean() // Populates children category information
    category.children.sort((a, b) => {
      return a.description ? a.description.localeCompare(b.description) : 0
    }) // Sorts the children categories alphabetically
    return category // Returns the category information
  },

  deactivate: async function(id) {
    let category = await MarketItemCategory.findOneWithDeleted({ _id: id }) // Gets the category
    await category.delete() // Deactivates it
    return category // Returns the deactivates category
  },

  activate: async function(id) {
    let category = await MarketItemCategory.findOneWithDeleted({ _id: id }) // Gets the category
    await category.restore() // Activates it
    return category // Returns the activated category
  },

  getSlug: async function(categoryId) {
    return new Promise((resolve, reject) => {
      MarketItemCategoriesCtrl.getParentsFor(categoryId, (error, parents) => {
        // Gets all the parent levels categories for the categoy
        if (error) return reject(error) // In case of error, returns it

        parents = parents.reverse() // Sets the proper parent order (root > parent > parent > ... > child)
        let categoryPath = '' // Initializes catgory path (parent-category-child-category)
        parents.map((parent, index) => {
          // For every category parent
          categoryPath += parent.description // Adds the category parent
          if (index !== parents.length - 1) categoryPath += '-' // Followed by a dash
        })
        let slug = SeoService.getSlugFrom(categoryPath.toLowerCase().replace(/\//g, '-')) // Sluggify the category path
        resolve(slug) // Returns the slug
      })
    })
  },

  getParentsFor: async function(categoryId, callback) {
    let getParentsFor = (categoryId, categories, callback) => {
      // Gets parents of all leves for given category
      MarketItemCategory.findOne(
        { _id: categoryId },
        'parent description isRoot _id',
        (error, category) => {
          // Retrieves the given category information
          if (error) return callback(error) // In case of error, returns it
          if (category) categories.push(category) // Adds parent to the list list
          return !category || category.isRoot
            ? callback(undefined, categories)
            : getParentsFor(category.parent, categories, callback) // So, that's a recursive loop
        }
      )
    }
    getParentsFor(categoryId, [], callback) // Starts the recursive loop
  },

  getAllCategoriesForItem: async function(id) {
    return new Promise(async (resolve, reject) => {
      // Retrieves all the categories and their information for a givem item
      let item = await MarketItem.findOne({ _id: id }, 'categories -_id') // Gets the item and information
      let itemCategories = item.categories || [] // Initializes item categories array
      let categories = [] // Initializes parsed categories array
      let currentCategory = 0 // Initializes iterated categories counter
      let lastCategory = itemCategories.length // Stop condition for the loop
      itemCategories.forEach(async (categoryId, index) => {
        // For every item category
        this.getParentsFor(categoryId, (error, parents) => {
          // Gets the multilevel parent categories
          if (error) return reject(error) // In case of errors, returns them
          if (parents && parents.length) {
            // In case there are any parents
            parents.filter(category => {
              return categories.indexOfObject('_id', category._id) == -1
            }) // Checks if the parent does not exists on the list
            categories = categories.concat(parents) // Adds the new parents found
          }
          if (++currentCategory == lastCategory) {
            // In case the loop ended
            resolve(categories) // Returns the results
          }
        })
      })
    })
  },

  getCategoriesForItems: async function(items) {
    return new Promise(async (resolve, reject) => {
      // Gets all the levels of categories for given items list
      let categories =
        (await MarketItem.aggregate([
          { $match: { _id: { $in: items } } }, // For the given items
          { $unwind: '$fullCategoriesList' }, // Retrieve the full categories list
          { $group: { _id: '$fullCategoriesList' } } // As unique category ids
        ])) || []
      categories = categories.map(category => category._id + '') // Reduces the categories results to an array of ids
      resolve(categories) // Returns the results
    })
  },

  withDeleted: function(user) {
    return user && user.role == 'ADMIN' ? {} : { deleted: false } // Checks if the queries must return deactivates items or not
  }
})

/*     getItemsForCategoryAsAdmin: async function (category) {
        let categorySlug = category // Gets category slug
        let category = await MarketItemCategory.findOne({ slug: categorySlug }) // Gets category information
        let items = (await MarketItem.findWithDeleted({ // Retrieves all items for the category (including the deleted ones)
            status: "active", // As long as it is active
            fullCategoriesList: { $elemMatch: { $in: [category._id] } } // And inside the category
        }).populate('categories')).map((marketItem) => { // Then formats the item
            return { // Since the inventory. promotion and cart items have an information field
                _id: marketItem._id, // We set the catalogue item _id
                information: marketItem // And add the informaiton field in order to keep compatibility
            }
        })
       return category && items ? { description: category.description, items: items } : {} // Finally, returns the results
    }, */

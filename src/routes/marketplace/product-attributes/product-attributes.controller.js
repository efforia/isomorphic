/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item attribute controller.
 */

// --------------- Module Imports
import ProductAttribute from './product-attribute.model'

const ProductAttributesCtrl = {
  save: async (attributeInfo) => {
    let attribute = await ProductAttribute.findOne({
      description: attributeInfo.description
    }).lean() // Searches for the item
    if (attribute) return attribute // In case the item exists, returns it
    return ProductAttribute.create(attributeInfo) // Otherwhise, creates it
  },
  list: async () => {
    return ProductAttribute.find({}, null, { sort: { description: 1 } }) // Returns attributes list
  }
}
export default ProductAttributesCtrl

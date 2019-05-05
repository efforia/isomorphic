/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Market item attribute controller.
 */

// --------------- Module Imports
import MarketItemAttribute from './market-item-attribute.model'

const MarketItemAttributesCtrl = {
  save: async function(attributeInfo) {
    let attribute = await MarketItemAttribute.findOne({
      description: attributeInfo.description
    }).lean() // Searches for the item
    if (attribute) return attribute // In case the item exists, returns it
    return await MarketItemAttribute.create(attributeInfo) // Otherwhise, creates it
  },
  list: async function() {
    return await MarketItemAttribute.find({}, null, { sort: { description: 1 } }) // Returns attributes list
  }
}
export default MarketItemAttributesCtrl

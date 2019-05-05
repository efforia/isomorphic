/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Lead controller.
 */

// --------------- Module Imports
import Lead from './lead.model'

// --------------- Module Variables

// --------------- Module Controller
const LeadsCtrl = {
  save: async function(lead) {
    let saved = await Lead.create(lead)
    return saved // Returns the created lead
  },
  list: async function() {
    return (await Lead.find()).map(lead => lead.email) // Gets leads list
  },
  get: async function(id) {
    return await Lead.findOne({ _id: id }) // Gets the lead information
  }
}
export default LeadsCtrl

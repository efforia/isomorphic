/**
 * @license MIT
 * @version 1.1.0
 * @author Leonardo Quevedo
 * @description Production import module.
 */

require('colors')
const path = require('path')
const fs = require('fs-extra')
const productsPath = path.resolve(__dirname, '../../.tmp/products')
const productsSourcePath = path.join(productsPath, 'files')
const productsSeedsPath = path.join(productsPath, 'seeds')
const productsDirFiles = fs.readdirSync(productsSourcePath)
const xlsx2json = require('xlsx2json')
const titlecase = require('titlecase')
const mammoth = require('mammoth')

let products = []
let categories = [],
  category = {},
  categoryIndex = -1,
  subcategoryIndex

let getProductDetails = async file => {
  return new Promise(async (resolve, reject) => {
    try {
      let infoPath = path.join(productsSourcePath, file)
      let parsed = await mammoth.extractRawText({ path: infoPath })
      // console.log(`☮ Products Importer: Reading ${file}...`.yellow);
      resolve(parsed ? parsed.value.trim() : undefined)
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })
}

let formatProduct = async product => {
  return new Promise(async (resolve, reject) => {
    if (!product.PRODUTO || !product.CATEGORIA) return resolve(undefined)
    console.log(`☮ Products Importer: Formatting ${product.IMAGEM}...`.yellow)
    let formatted = {
      category: titlecase(`${product.CATEGORIA}`.toLowerCase()),
      description: await getProductDetails(`${product.INFOS}.docx`),
      subcategory: titlecase(`${product.SUBCATEGORIA}`.toLowerCase()),
      name: titlecase(
        (
          `${product.PRODUTO} ` + (product.APRESENTACAO ? `(${product.APRESENTACAO})` : '')
        ).toLowerCase()
      ),
      brand: titlecase(product.INDUSTRIA.toLowerCase()),
      picture: `${product.IMAGEM}`,
      infos: `${product.INFOS}.docx`,
      pets: titlecase(product.PETS),
      type: titlecase(product.TIPO)
    }
    resolve(formatted)
  })
}

let handleProductCategories = product => {
  console.log(`☮ Products Importer: Parsing ${product.picture} categories...`.yellow)
  if (product.category) {
    categoryIndex = categories.indexOfObject('description', product.category)
    if (categoryIndex > -1) {
      category = categories[categoryIndex]
      subcategoryIndex = category.children.indexOfObject('description', product.subcategory)
      if (!(subcategoryIndex > -1))
        category.children.push({
          description: product.subcategory
        })
    } else {
      categories.push({
        description: product.category,
        children: []
      })
    }
  }
}

let readProductsSheet = async filePath => {
  console.log(`☮ Products Importer: Reading ${filePath} sheet...`.yellow)
  await xlsx2json(filePath, { keysRow: 1 }).then(async innerSheets => {
    await Promise.all(
      innerSheets.map(async sheet => {
        await Promise.all(
          sheet.map(async product => {
            return new Promise(async (resolve, reject) => {
              product = await formatProduct(product)
              if (product) {
                handleProductCategories(product)
                products.push(product)
              }
              resolve()
            })
          })
        )
      })
    )
  })
}

let execute = () => {
  console.log(`☮ Products Importer: Starting script...`.yellow)

  fs.ensureDirSync(productsPath)
  console.log(`☮ Products Importer: Filtering files...`.yellow)
  const productSheets = productsDirFiles.filter(file => file.indexOf('xlsx') > -1)
  console.log(`☮ Products Importer: Processing files...`.yellow)
  let processTasks = productSheets.map(file => {
    return new Promise(async (resolve, reject) => {
      console.log(`☮ Products Importer: Processing file ${file}...`.yellow)
      let filePath = path.join(productsSourcePath, file)
      await readProductsSheet(filePath)
      resolve()
    })
  })
  Promise.all(processTasks).then(async () => {
    await fs.ensureDirSync(productsSeedsPath)
    let categoriesSeedPath = path.join(productsSeedsPath, 'categories.json')
    let productItemsSeedsPath = path.join(productsSeedsPath, 'products.json')
    console.log(`☮ Products Importer: Writing categories to categories.json...`.yellow)
    fs.writeFileSync(categoriesSeedPath, JSON.stringify(categories, null, '\t'))
    console.log(`☮ Products Importer: Writing products to products.json...`.yellow)
    fs.writeFileSync(productItemsSeedsPath, JSON.stringify(products, null, '\t'))
  })
}

execute()

// Extend utils
Array.prototype.indexOfObject = function(property, value) {
  for (var i = 0, len = this.length; i < len; i++) {
    if (this[i][property] === value) return i
  }
  return -1
}

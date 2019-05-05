import 'colors'
import path from 'path'
import fs from 'fs-extra'
import { Storage } from '@google-cloud/storage'
import MarketItem from '../routes/marketplace/market-items/market-item.model'
import MarketItemCategory from '../routes/marketplace/market-item-categories/market-item-category.model'
import Picture from '../routes/pictures/picture.model'
import SEOUtils from '../services/seo.service'

const config = require('dotenv').config()
require('dotenv-expand')(config)

// Seeds load
const productsPath = path.resolve(__dirname, '../.tmp/products')
const productsSeedsPath = path.join(productsPath, 'seeds')
const categories = require(path.join(productsSeedsPath, 'categories.json'))
const products = require(path.join(productsSeedsPath, 'products.json'))
const productsSourcePath = path.join(productsPath, 'files')
const productsDirFiles = fs.readdirSync(productsSourcePath)

// --------------- Module Variables
const bucket = process.env.FIREBASE_CONFIG_STORAGE_BUCKET
const storage = new Storage({
  projectId: process.env.FIREBASE_CONFIG_PROJECT_ID
})

const { log } = console

const saveCategories = () => {
  log(`☮ DB: Planting seeds for the MarketItemCategory model...`.yellow)
  MarketItemCategory.remove({}, async () => {
    await Promise.all(
      categories.map(async category => {
        const rawChildren = [].concat(category.children)
        return new Promise(async resolve => {
          log(`Creating ${category.description}...`)
          const children = []
          let parent = await MarketItemCategory.findOne({
            description: category.description
          })
          if (!parent)
            parent = await MarketItemCategory.create(
              Object.assign(category, {
                isRoot: true,
                children: [],
                slug: SEOUtils.getSlugFrom(category.description)
              })
            )
          await Promise.all(
            rawChildren.map(child => {
              log(`Creating ${child.description}...`)
              return new Promise(async resolve => {
                let createdChild = await MarketItemCategory.findOne({
                  description: child.description
                })
                if (!createdChild) {
                  createdChild = await MarketItemCategory.create(
                    Object.assign(child, {
                      parent: parent._id,
                      slug: SEOUtils.getSlugFrom(`${parent.description} ${child.description}`)
                    })
                  )
                  children.push(createdChild._id)
                }
                resolve()
              })
            })
          )
          const updated = await MarketItemCategory.findOneAndUpdate(
            { _id: parent._id },
            { children }
          )
          log('Created category ', updated)
          resolve()
        })
      })
    )
    log('Created categories')
  })
}

const savePictures = async () => {
  const pictures = productsDirFiles.filter(file => file.indexOf('png') > -1)
  await Promise.all(
    pictures.map(
      picture =>
        new Promise(async (resolve, reject) => {
          const filepath = path.join(productsSourcePath, picture)
          const filename = `/products/pictures/${picture}`
          try {
            await storage
              .bucket(bucket)
              .upload(filepath, { destination: filename, resumable: false }) // Opens the storage bucket
            const bucketFile = await storage.bucket(bucket).file(filename) // Creates a bucket file
            await bucketFile.makePublic() // Sets the file as public
            const externalRef = (await bucketFile.getMetadata())[0].mediaLink // Gets the reference to the file
            resolve(externalRef)
          } catch (e) {
            resolve(e)
          }
        })
    )
  )
}

const saveItems = () => {
  log(`☮ DB: Planting seeds for the MarketItem model...`.yellow)
  let failureCount = 0
  MarketItem.find({}, async () => {
    const pictureFiles = (await storage.bucket(bucket).getFiles())[0]
    await Promise.all(
      products.map(
        productRef =>
          new Promise(async (resolve, reject) => {
            try {
              const product = { ...{}, ...productRef }
              const categorySlug = SEOUtils.getSlugFrom(product.category)
              const subcategorySlug = SEOUtils.getSlugFrom(
                `${product.category ? product.category : ''} ${product.subcategory}`
              )
              const category = await MarketItemCategory.findOne({
                slug: categorySlug
              })
              const subcategory = await MarketItemCategory.findOne({
                slug: subcategorySlug
              })
              const picture = pictureFiles.filter(
                file =>
                  file &&
                  file.metadata &&
                  file.metadata.name &&
                  file.metadata.name.indexOf(product.picture) > -1
              )[0]
              product.categories = [subcategory._id]
              product.fullCategoriesList = [category, subcategory]
              product.slug = SEOUtils.getSlugFrom(product.name)
              if (product.brand)
                product.attributes = [{ label: '5af1df291bd1ed1d4c0d5a14', value: product.brand }]
              product.status = 'active'
              product.pictureRef = product.picture
              delete product.category
              delete product.subcategory
              delete product.brand
              let item = await MarketItem.findOne({ slug: product.slug })
              if (!item) item = await MarketItem.create(product)
              if (picture && picture.metadata && item) {
                const { metadata } = picture
                /* await picture.makePublic() */
                const pictureExists = await Picture.findOne({
                  ownerId: item._id
                })
                let createdPicture = await Picture.findOne({ ownerId: item._id })
                if (!pictureExists)
                  createdPicture = new Picture({
                    ownerId: item._id,
                    mimeType: metadata.name.split('.')[1],
                    sent: new Date(),
                    file: product.picture,
                    externalRef: metadata.mediaLink
                  })
                if (!pictureExists) await createdPicture.save()
                await MarketItem.findOneAndUpdate(
                  { _id: item._id },
                  {
                    pictures: [createdPicture._id],
                    description: product.description
                  }
                )
              }
              log('Item saved!')
              resolve()
            } catch (e) {
              log(e)
              failureCount += 1
              log('Failed to save item!')
              reject()
            }
          })
      )
    )
    log(`☮ DB: MarketItem seeds planted!`.green)
    log(`Failure count: ${failureCount}`)
  })
}

const execute = async () => {
  // await savePictures();
  await saveCategories()
  saveItems()
}

execute()

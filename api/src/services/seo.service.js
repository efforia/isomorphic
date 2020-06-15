import slug from 'slug'

const SEO = {
  getSlugFrom: name => name ? slug(name.toLowerCase()) : ''
}

export default SEO

import slug from 'slug'

const SEO = {
  getSlugFrom: name => {
    return name ? slug(name.toLowerCase()) : ''
  }
}

export default SEO

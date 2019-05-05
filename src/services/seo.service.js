import slug from 'slug'

const SEO = {
  getSlugFrom: function(name) {
    return name ? slug(name.toLowerCase()) : ''
  }
}
export default SEO

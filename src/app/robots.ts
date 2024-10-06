import type { MetadataRoute } from 'next'
import { baseUrl } from './sitemap'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
	  disallow: ["/login", "/register", "/api"]
    },
    sitemap: baseUrl + "/manifest.webmanifest",
  }
}
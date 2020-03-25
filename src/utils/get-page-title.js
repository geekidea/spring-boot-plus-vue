import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Spring Boot Plus Vue'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}


import { MetadataRoute } from 'next'
import { getPublicCourses } from '@/app/actions/courses'
import { getEvents } from '@/app/actions/events'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ngistudyzone.com'

  // Static routes
  const staticPaths = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/courses',
    '/events',
    '/exams',
    '/faculty',
    '/gallery',
    '/notices',
    '/results',
    '/verify',
  ]

  const staticRoutes = staticPaths.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Courses
  let courseRoutes: MetadataRoute.Sitemap = []
  try {
    const courseRes = await getPublicCourses()
    if (courseRes.success && Array.isArray(courseRes.courses)) {
      courseRoutes = courseRes.courses.map((course: any) => ({
        url: `${baseUrl}/courses/${course.slug || course._id}`,
        lastModified: new Date(course.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch (e) {
    console.error('Sitemap course fetch error:', e)
  }

  // Dynamic Events
  let eventRoutes: MetadataRoute.Sitemap = []
  try {
    const eventRes = await getEvents()
    if (eventRes.success && Array.isArray(eventRes.events)) {
      eventRoutes = eventRes.events.map((event: any) => ({
        url: `${baseUrl}/events/${event._id}`,
        lastModified: new Date(event.updatedAt || event.date || new Date()),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    }
  } catch (e) {
    console.error('Sitemap event fetch error:', e)
  }

  return [...staticRoutes, ...courseRoutes, ...eventRoutes]
}

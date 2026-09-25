import { Button } from '@filecoin-foundation/ui-filecoin/Button'
import { CardGrid } from '@filecoin-foundation/ui-filecoin/CardGrid'
import { PageSection } from '@filecoin-foundation/ui-filecoin/PageSection'
import { SectionContent } from '@filecoin-foundation/ui-filecoin/SectionContent'

import { PATHS } from '@/constants/paths'

import { BlogCard } from '@/blog/components/BlogCard'
import type { getFeaturedBlogPosts } from '@/blog/utils/getFeaturedBlogPosts'

type LatestNewsSectionProps = {
  title: string
  description: string
  viewAllCta: string
  posts: Awaited<ReturnType<typeof getFeaturedBlogPosts>>
}

export function LatestNewsSection({
  title,
  description,
  viewAllCta,
  posts,
}: LatestNewsSectionProps) {
  if (posts.length === 0) return null

  return (
    <PageSection backgroundVariant="light">
      <SectionContent
        headingTag="h2"
        title={title}
        description={description}
        ctaPosition="inline"
        cta={
          <Button href={PATHS.BLOG.path} variant="ghost" size="compact">
            {viewAllCta}
          </Button>
        }
      >
        <CardGrid as="ul" variant="mdTwoLgThreeWide">
          {posts.map(({ title, slug, excerpt, tags, image, author, publishedOn }) => (
            <BlogCard
              key={slug}
              slug={slug}
              title={title}
              description={excerpt}
              author={author}
              date={publishedOn}
              tags={tags}
              image={
                image && {
                  src: image.url,
                  alt: title,
                }
              }
            />
          ))}
        </CardGrid>
      </SectionContent>
    </PageSection>
  )
}

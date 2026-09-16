import { type HeadingProps } from '../Heading'

import { Carousel } from './Carousel/Carousel'
import { CarouselAutoScrollControls } from './Carousel/CarouselAutoScrollControls'
import { CarouselContent } from './Carousel/CarouselContent'
import type { CarouselGradientProps } from './Carousel/CarouselGradient'
import { CarouselItem } from './Carousel/CarouselItem'
import { type LogoItemProps, LogoItem } from './LogoItem'

type LogoSectionProps = {
  headingTag: HeadingProps['tag']
  title: string
  logos: Array<LogoItemProps>
  autoPlay?: boolean
  gradientVariant: CarouselGradientProps['variant']
}

export function LogoSection({
  headingTag,
  title,
  logos,
  autoPlay,
  gradientVariant,
}: LogoSectionProps) {
  const Tag = headingTag

  return (
    <section
      className="logo-section flex flex-col items-center gap-8"
      aria-labelledby="logo-section-title"
    >
      <Carousel autoPlay={autoPlay}>
        <CarouselContent gradientVariant={gradientVariant}>
          {logos.map((logoItem, index) => (
            <CarouselItem key={index} range={logos.length}>
              <div className="grid h-full place-items-center p-0.5">
                <LogoItem {...logoItem} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselAutoScrollControls />
      </Carousel>

      <Tag
        id="logo-section-title"
        className="text-sm text-(--color-paragraph-text)"
      >
        {title}
      </Tag>
    </section>
  )
}

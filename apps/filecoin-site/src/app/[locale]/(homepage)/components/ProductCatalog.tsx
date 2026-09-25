import { Heading } from '@filecoin-foundation/ui-filecoin/Heading'

import { ProductPill, type ProductPillProps } from './ProductPill'

export type Product = ProductPillProps

export type ProductGroup = {
  title: string
  description: string
  products: Array<Product>
}

type ProductCatalogProps = {
  groups: Array<ProductGroup>
}

export function ProductCatalog({ groups }: ProductCatalogProps) {
  return (
    <div className="divide-y divide-(--color-border-muted) border-y border-(--color-border-muted)">
      {groups.map(({ title, description, products }) => (
        <section
          key={title}
          className="grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:gap-10"
        >
          <div className="space-y-2 md:col-span-4">
            <Heading tag="h3" variant="card-heading">
              {title}
            </Heading>
            <p className="text-(--color-paragraph-text)">{description}</p>
          </div>

          <ul className="flex flex-wrap gap-3 md:col-span-8">
            {products.map((product) => (
              <li key={product.label}>
                <ProductPill {...product} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

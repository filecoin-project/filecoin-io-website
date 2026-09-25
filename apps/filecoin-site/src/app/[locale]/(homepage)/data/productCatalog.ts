import type { TranslationFunction } from '@/i18n/types'

import { ArrowsClockwiseIcon } from '@phosphor-icons/react/dist/ssr'

import { PATHS } from '@/constants/paths'

import type { Product, ProductGroup } from '../components/ProductCatalog'

import { PRODUCTS, type ProductKey } from './products'

function toProduct(key: ProductKey, t: TranslationFunction): Product {
  return { label: t(`products.${key}`), ...PRODUCTS[key] }
}

// PLACEHOLDER — the "full product list" from the wireframe. Grouping follows
// the brief's split between core Filecoin developer products and managed
// services built on Filecoin. Product identity (href, icon) comes from the
// shared registry in `data/products.ts`, which also backs the "products used"
// pills in the use-case section and the navigation IA.
export function getProductCatalog(t: TranslationFunction): Array<ProductGroup> {
  return [
    {
      title: t('catalog.groups.storage.title'),
      description: t('catalog.groups.storage.description'),
      products: [
        toProduct('warmStorage', t),
        toProduct('archivalStorage', t),
        toProduct('filecoinPin', t),
        toProduct('filOne', t),
      ],
    },
    {
      title: t('catalog.groups.retrieval.title'),
      description: t('catalog.groups.retrieval.description'),
      products: [toProduct('retrieval', t), toProduct('ipfsGateways', t)],
    },
    {
      title: t('catalog.groups.payments.title'),
      description: t('catalog.groups.payments.description'),
      products: [toProduct('filecoinPay', t), toProduct('usdfc', t)],
    },
    {
      title: t('catalog.groups.developerTools.title'),
      description: t('catalog.groups.developerTools.description'),
      products: [
        toProduct('synapseSdk', t),
        toProduct('smartContracts', t),
        toProduct('documentation', t),
      ],
    },
    {
      title: t('catalog.groups.managedServices.title'),
      description: t('catalog.groups.managedServices.description'),
      products: [
        toProduct('akaveCloud', t),
        toProduct('lighthouse', t),
        toProduct('cidgravity', t),
        toProduct('storacha', t),
        {
          label: t('catalog.viewAllProviders'),
          href: PATHS.STORE_DATA.path,
          icon: ArrowsClockwiseIcon,
          variant: 'muted',
        },
      ],
    },
  ]
}

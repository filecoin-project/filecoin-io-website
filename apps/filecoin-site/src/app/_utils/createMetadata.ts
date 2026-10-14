import {
  createMetadata as sharedCreateMetadata,
  type MetadataParams as SharedMetadataParams,
} from '@filecoin-foundation/utils/createMetadata'

import {
  FILECOIN_URLS,
  OG_IMAGE,
  ORGANIZATION_NAME,
} from '@/constants/siteMetadata'

export type MetadataParams = Omit<
  SharedMetadataParams,
  'fallbackImage' | 'orgName' | 'orgHandle'
>

export function createMetadata(args: MetadataParams) {
  return sharedCreateMetadata({
    ...args,
    fallbackImage: OG_IMAGE,
    orgName: ORGANIZATION_NAME,
    orgHandle: FILECOIN_URLS.social.twitter.handle,
  })
}

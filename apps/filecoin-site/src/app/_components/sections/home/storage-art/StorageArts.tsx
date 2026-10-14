import ArtStage, { ExtraLayer, type Choreography } from './ArtStage'
import { AGENT_STORAGE_PARTS } from './parts/agent-storage'
import { BACKUP_ARCHIVES_PARTS } from './parts/backup-archives'
import { DATA_STORAGE_PARTS } from './parts/data-storage'
import { ENTERPRISE_STORAGE_PARTS } from './parts/enterprise-storage'
import { IPFS_PARTS } from './parts/ipfs'

// Each scene assembles in reading order: the subject first, then what feeds it, then what it
// produces. Delays are in ms from the moment the illustration becomes active.

const DATA_STORAGE: Choreography = {
  core: { enter: 'scale', delay: 0 },
  'core-logo': { enter: 'scale', delay: 140 },
  'chip-datasets': { enter: 'drop', delay: 180 },
  'chip-training': { enter: 'drop', delay: 250 },
  'chip-video': { enter: 'drop', delay: 320 },
  'connectors-in': { enter: 'reveal-down', delay: 380, loop: 'flow-down' },
  'connectors-out': { enter: 'reveal-down', delay: 660, loop: 'flow-down' },
  'card-retrieve': { enter: 'rise', delay: 780 },
  'card-paid': { enter: 'rise', delay: 860 },
  'toggle-knob': { enter: 'switch', delay: 860 },
  'toggle-track': { enter: 'fade', delay: 1600 },
}

export function DataStorageArt() {
  return (
    <ArtStage
      id="art-data-storage"
      label="Datasets, AI training data and video libraries flow into Filecoin, and out again as on-demand retrieval and paid access."
      parts={DATA_STORAGE_PARTS}
      choreography={DATA_STORAGE}
      crop={[39, 63, 642, 434]}
      extras={{
        // The paid-access switch starts off: a grey track under the blue one, which fades in as
        // the knob slides across.
        'toggle-track': (
          <ExtraLayer box={[582, 433, 34, 22]} enter="rise" delay={860}>
            <rect
              x="583"
              y="434"
              width="32"
              height="20"
              rx="10"
              fill="#E4E4E4"
            />
          </ExtraLayer>
        ),
      }}
    />
  )
}

const BACKUP_ARCHIVES: Choreography = {
  'card-front': { enter: 'rise', delay: 0 },
  'card-middle': { enter: 'rise', delay: 160, from: 'translate3d(0, 16px, 0)' },
  'card-back': { enter: 'rise', delay: 260, from: 'translate3d(0, 32px, 0)' },
  'link-upper': { enter: 'reveal-down', delay: 520 },
  proof: { enter: 'scale', delay: 640 },
  'link-lower': { enter: 'reveal-down', delay: 760 },
  'timeline-past': { enter: 'reveal-right', delay: 820 },
  'label-start': { enter: 'fade', delay: 1000 },
  'timeline-future': { enter: 'fade', delay: 1100 },
  'label-end': { enter: 'fade', delay: 1150 },
  'today-core': { enter: 'scale', delay: 1250 },
  'today-halo': { enter: 'scale', delay: 1250, loop: 'pulse' },
  'label-today': { enter: 'fade', delay: 1300 },
}

export function BackupArchivesArt() {
  return (
    <ArtStage
      id="art-backup-archives"
      label="A media archive of 1,284 files and 12.6 TB, stored in March 2021 and retained for 10 years across 3 providers, with its storage proof verified today."
      parts={BACKUP_ARCHIVES_PARTS}
      choreography={BACKUP_ARCHIVES}
      crop={[41, 87, 638, 383]}
    />
  )
}

const AGENT_STORAGE: Choreography = {
  'chip-terminal': { enter: 'left', delay: 0 },
  'chip-editor': { enter: 'left', delay: 70 },
  'chip-browser': { enter: 'left', delay: 140 },
  'links-in': { enter: 'reveal-right', delay: 260, loop: 'flow-right' },
  hub: { enter: 'scale', delay: 420 },
  'agent-mark': { enter: 'scale', delay: 500, loop: 'twinkle' },
  log: { enter: 'rise', delay: 560 },
  'links-out': { enter: 'reveal-right', delay: 620, loop: 'flow-right' },
  'row-1': { enter: 'rise', delay: 720, from: 'translate3d(0, 8px, 0)' },
  'row-1-dot': {
    enter: 'rise',
    delay: 720,
    from: 'translate3d(0, 8px, 0)',
    loop: 'blink',
  },
  'row-2': { enter: 'rise', delay: 790, from: 'translate3d(0, 8px, 0)' },
  'row-3': { enter: 'rise', delay: 860, from: 'translate3d(0, 8px, 0)' },
  'row-4': { enter: 'rise', delay: 930, from: 'translate3d(0, 8px, 0)' },
  'row-5': { enter: 'rise', delay: 1000, from: 'translate3d(0, 8px, 0)' },
}

export function AgentStorageArt() {
  return (
    <ArtStage
      id="art-agent-storage"
      label="Terminal, editor and browser sessions connect through an agent to an append-only activity log of publish, share, write, read and run actions."
      parts={AGENT_STORAGE_PARTS}
      choreography={AGENT_STORAGE}
      crop={[27, 107, 666, 346]}
    />
  )
}

// IPFS: the pinned content first, then the three names that all resolve to it (they drop in and
// their links run down into it), then the storage proof it produces.
const IPFS: Choreography = {
  hub: { enter: 'scale', delay: 0 },
  'hub-mark': { enter: 'scale', delay: 140 },
  'chip-cid': { enter: 'drop', delay: 180 },
  'chip-ipns': { enter: 'drop', delay: 250 },
  'chip-gateway': { enter: 'drop', delay: 320 },
  'links-in': { enter: 'reveal-down', delay: 380, loop: 'flow-down' },
  'link-down': { enter: 'reveal-down', delay: 660, loop: 'flow-down' },
  proof: { enter: 'rise', delay: 780 },
  'proof-mark': { enter: 'scale', delay: 880 },
}

export function IpfsArt() {
  return (
    <ArtStage
      id="art-ipfs"
      label="A CID, an IPNS name and a gateway link all resolve to the same content, pinned on Filecoin with verifiable storage and a proof checked today."
      parts={IPFS_PARTS}
      choreography={IPFS}
      crop={[28, 84, 664, 392]}
    />
  )
}

// Enterprise: the tools you already use slide in and feed one client-side encryption step, which
// writes to the bucket; its Private switch slides on and its files and access rules rise in.
const ENTERPRISE_STORAGE: Choreography = {
  'tool-sdk': { enter: 'left', delay: 0 },
  'tool-cli': { enter: 'left', delay: 70 },
  'tool-app': { enter: 'left', delay: 140 },
  'links-in': { enter: 'reveal-right', delay: 260, loop: 'flow-right' },
  hub: { enter: 'scale', delay: 420 },
  'hub-mark': { enter: 'scale', delay: 500 },
  caption: { enter: 'fade', delay: 560 },
  'link-out': { enter: 'reveal-right', delay: 620, loop: 'flow-right' },
  bucket: { enter: 'rise', delay: 720 },
  'toggle-knob': { enter: 'switch', delay: 720 },
  'toggle-track': { enter: 'fade', delay: 1460 },
  'row-backup': { enter: 'rise', delay: 860, from: 'translate3d(0, 8px, 0)' },
  'row-reports': { enter: 'rise', delay: 930, from: 'translate3d(0, 8px, 0)' },
  'row-access': { enter: 'rise', delay: 1000, from: 'translate3d(0, 8px, 0)' },
}

export function EnterpriseStorageArt() {
  return (
    <ArtStage
      id="art-enterprise-storage"
      label="An S3 SDK, the AWS CLI and your own app all write through client-side encryption into a private Fil One bucket, with access control for each team and tool."
      parts={ENTERPRISE_STORAGE_PARTS}
      choreography={ENTERPRISE_STORAGE}
      crop={[30, 152, 660, 256]}
      extras={{
        // As on Warm Storage, the Private switch starts off: a grey track under the blue one,
        // which fades in as the knob slides across.
        'toggle-track': (
          <ExtraLayer box={[631, 209, 34, 22]} enter="rise" delay={720}>
            <rect
              x="632"
              y="210"
              width="32"
              height="20"
              rx="10"
              fill="#E4E4E4"
            />
          </ExtraLayer>
        ),
      }}
    />
  )
}

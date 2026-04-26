'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  TabsContent_Shadcn_,
  TabsList_Shadcn_,
  TabsTrigger_Shadcn_,
  Tabs_Shadcn_,
  cn,
} from 'ui'

import { useCommunityDocsSearch } from '@/components/CommunityDocsSearchProvider.client'
import { SupabaseMark } from '@/components/TopNav'
import type { CommunityDocSection, CommunityDocSummary } from '@/lib/content'

type AreaIconProps = {
  className?: string
}

const languageColorByName: Record<string, string> = {
  JavaScript: 'bg-yellow-500',
  TypeScript: 'bg-blue-500',
  Rust: 'bg-orange-700',
  Go: 'bg-cyan-500',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-500',
  Python: 'bg-blue-400',
  PHP: 'bg-indigo-400',
  Ruby: 'bg-red-500',
  Vue: 'bg-emerald-500',
  Svelte: 'bg-orange-600',
}

const areas = [
  { label: 'Database', icon: 'database' },
  { label: 'Auth', icon: 'auth' },
  { label: 'Storage', icon: 'storage' },
  { label: 'Realtime', icon: 'realtime' },
  { label: 'Edge Functions', icon: 'edge-functions' },
  { label: 'Other', icon: 'other' },
] as const

const clientLibraryFeatures = [
  'Supabase',
  'PostgREST',
  'Auth',
  'Realtime',
  'Storage',
  'Edge Runtime',
] as const

type ClientLibraryFeature = (typeof clientLibraryFeatures)[number]

type ClientLibrary = {
  language: string
  group: 'Official' | 'Community'
  libraries: Record<ClientLibraryFeature, string | null>
}

const clientLibraries: ClientLibrary[] = [
  {
    language: 'JavaScript (TypeScript)',
    group: 'Official',
    libraries: {
      Supabase: 'supabase-js',
      PostgREST: 'postgrest-js',
      Auth: 'auth-js',
      Realtime: 'realtime-js',
      Storage: 'storage-js',
      'Edge Runtime': 'functions-js',
    },
  },
  {
    language: 'Flutter',
    group: 'Official',
    libraries: {
      Supabase: 'supabase-flutter',
      PostgREST: 'postgrest-dart',
      Auth: 'gotrue-dart',
      Realtime: 'realtime-dart',
      Storage: 'storage-dart',
      'Edge Runtime': 'functions-dart',
    },
  },
  {
    language: 'Swift',
    group: 'Official',
    libraries: {
      Supabase: 'supabase-swift',
      PostgREST: 'postgrest-swift',
      Auth: 'auth-swift',
      Realtime: 'realtime-swift',
      Storage: 'storage-swift',
      'Edge Runtime': 'functions-swift',
    },
  },
  {
    language: 'Python',
    group: 'Official',
    libraries: {
      Supabase: 'supabase-py',
      PostgREST: 'postgrest-py',
      Auth: 'auth-py',
      Realtime: 'realtime-py',
      Storage: 'storage-py',
      'Edge Runtime': 'functions-py',
    },
  },
  {
    language: 'C#',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-csharp',
      PostgREST: 'postgrest-csharp',
      Auth: 'gotrue-csharp',
      Realtime: 'realtime-csharp',
      Storage: 'storage-csharp',
      'Edge Runtime': 'functions-csharp',
    },
  },
  {
    language: 'F#',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-fsharp',
      PostgREST: 'postgrest-fsharp',
      Auth: 'gotrue-fsharp',
      Realtime: null,
      Storage: 'storage-fsharp',
      'Edge Runtime': 'functions-fsharp',
    },
  },
  {
    language: 'Go',
    group: 'Community',
    libraries: {
      Supabase: null,
      PostgREST: 'postgrest-go',
      Auth: 'auth-go',
      Realtime: null,
      Storage: 'storage-go',
      'Edge Runtime': 'functions-go',
    },
  },
  {
    language: 'Elixir',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-ex',
      PostgREST: 'postgrest-ex',
      Auth: 'auth-ex',
      Realtime: 'realtime-ex',
      Storage: 'storage-ex',
      'Edge Runtime': 'functions-ex',
    },
  },
  {
    language: 'Java',
    group: 'Community',
    libraries: {
      Supabase: null,
      PostgREST: null,
      Auth: 'gotrue-java',
      Realtime: null,
      Storage: 'storage-java',
      'Edge Runtime': null,
    },
  },
  {
    language: 'Kotlin',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-kt',
      PostgREST: 'postgrest-kt',
      Auth: 'auth-kt',
      Realtime: 'realtime-kt',
      Storage: 'storage-kt',
      'Edge Runtime': 'functions-kt',
    },
  },
  {
    language: 'PHP',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-php',
      PostgREST: 'postgrest-php',
      Auth: 'gotrue-php',
      Realtime: 'realtime-php',
      Storage: 'storage-php',
      'Edge Runtime': 'functions-php',
    },
  },
  {
    language: 'Ruby',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-rb',
      PostgREST: 'postgrest-rb',
      Auth: null,
      Realtime: null,
      Storage: null,
      'Edge Runtime': null,
    },
  },
  {
    language: 'Rust',
    group: 'Community',
    libraries: {
      Supabase: null,
      PostgREST: 'postgrest-rs',
      Auth: 'auth-rs',
      Realtime: null,
      Storage: null,
      'Edge Runtime': null,
    },
  },
  {
    language: 'Godot Engine (GDScript)',
    group: 'Community',
    libraries: {
      Supabase: 'supabase-gdscript',
      PostgREST: 'postgrest-gdscript',
      Auth: 'gotrue-gdscript',
      Realtime: 'realtime-gdscript',
      Storage: 'storage-gdscript',
      'Edge Runtime': 'functions-gdscript',
    },
  },
]

const selfHostedProjects = [
  {
    name: 'supabase-kubernetes',
    description: 'Helm charts to deploy Supabase on Kubernetes.',
  },
  {
    name: 'supabase-terraform',
    description: 'Terraform resources for self-hosting Supabase.',
  },
  {
    name: 'supabase-traefik',
    description: 'Traefik configuration for self-hosted Supabase deployments.',
  },
  {
    name: 'supabase-on-aws',
    description: 'CDK and CloudFormation templates for Supabase on AWS.',
  },
]

const utilityGroups: { heading: string; items: { name: string; description?: string }[] }[] = [
  {
    heading: 'General',
    items: [
      {
        name: 'sql-examples',
        description: 'Curated list of SQL to help you find useful script easily.',
      },
    ],
  },
  {
    heading: 'Dart + Flutter',
    items: [{ name: 'supabase-flutter-quickstart' }],
  },
  {
    heading: 'React + Next',
    items: [{ name: 'next-server-components' }],
  },
  {
    heading: 'Svelte',
    items: [
      { name: 'svelte-supabase' },
      { name: 'supabase-ui-svelte' },
      { name: 'supabase-sveltekit-example' },
      { name: 'svelte-kanban' },
    ],
  },
  {
    heading: 'Vue + Nuxt',
    items: [{ name: 'nuxt-supabase' }, { name: 'vue-supabase' }],
  },
]

const clientLibraryUrlByName: Record<string, string> = {
  'supabase-js': 'https://github.com/supabase/supabase-js',
  'postgrest-js': 'https://github.com/supabase/postgrest-js',
  'auth-js': 'https://github.com/supabase/auth-js',
  'realtime-js': 'https://github.com/supabase/realtime-js',
  'storage-js': 'https://github.com/supabase/storage-js',
  'functions-js': 'https://github.com/supabase/functions-js',
  'supabase-flutter': 'https://github.com/supabase/supabase-flutter/tree/main/packages/supabase_flutter',
  'postgrest-dart': 'https://github.com/supabase/supabase-flutter/tree/main/packages/postgrest',
  'gotrue-dart': 'https://github.com/supabase/supabase-flutter/tree/main/packages/gotrue',
  'realtime-dart':
    'https://github.com/supabase/supabase-flutter/tree/main/packages/realtime_client',
  'storage-dart': 'https://github.com/supabase/supabase-flutter/tree/main/packages/storage_client',
  'functions-dart':
    'https://github.com/supabase/supabase-flutter/tree/main/packages/functions_client',
  'supabase-swift': 'https://github.com/supabase/supabase-swift',
  'postgrest-swift': 'https://github.com/supabase/supabase-swift/tree/main/Sources/PostgREST',
  'auth-swift': 'https://github.com/supabase/supabase-swift/tree/main/Sources/Auth',
  'realtime-swift': 'https://github.com/supabase/supabase-swift/tree/main/Sources/Realtime',
  'storage-swift': 'https://github.com/supabase/supabase-swift/tree/main/Sources/Storage',
  'functions-swift': 'https://github.com/supabase/supabase-swift/tree/main/Sources/Functions',
  'supabase-py': 'https://github.com/supabase/supabase-py',
  'postgrest-py': 'https://github.com/supabase/postgrest-py',
  'auth-py': 'https://github.com/supabase/auth-py',
  'realtime-py': 'https://github.com/supabase/realtime-py',
  'storage-py': 'https://github.com/supabase/storage-py',
  'functions-py': 'https://github.com/supabase/functions-py',
  'postgrest-kt': 'https://github.com/supabase-community/supabase-kt/tree/master/Postgrest',
  'auth-kt': 'https://github.com/supabase-community/supabase-kt/tree/master/Auth',
  'realtime-kt': 'https://github.com/supabase-community/supabase-kt/tree/master/Realtime',
  'storage-kt': 'https://github.com/supabase-community/supabase-kt/tree/master/Storage',
  'functions-kt': 'https://github.com/supabase-community/supabase-kt/tree/master/Functions',
  'auth-rs': 'https://github.com/supabase-community/supabase-auth-rs',
  'supabase-gdscript': 'https://github.com/supabase-community/godot-engine.supabase',
}

function getAreaId(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatCount(value: number) {
  if (value >= 1000) {
    return `${Number.parseFloat((value / 1000).toFixed(1))}k`
  }

  return value.toString()
}

function getCommunityRepoUrl(name: string) {
  return `https://github.com/supabase-community/${name}`
}

function getClientLibraryUrl(name: string) {
  return clientLibraryUrlByName[name] ?? getCommunityRepoUrl(name)
}

const IconAreaDatabase = ({ className }: AreaIconProps) => (
  <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.5 2.99915C2.5 2.17072 3.17157 1.49915 4 1.49915H12C12.8284 1.49915 13.5 2.17072 13.5 2.99915V4.99915C13.5 5.53212 13.222 6.00017 12.8032 6.26623V9.73377C13.222 9.99983 13.5 10.4679 13.5 11.0009V13.0009C13.5 13.8293 12.8284 14.5009 12 14.5009H4C3.17157 14.5009 2.5 13.8293 2.5 13.0009V11.0009C2.5 10.4615 2.78461 9.98872 3.21183 9.72437V6.27563C2.78461 6.01128 2.5 5.53845 2.5 4.99915V2.99915ZM12.0158 5.4989H3.98422C3.71538 5.49057 3.5 5.27001 3.5 4.99915V2.99915C3.5 2.723 3.72386 2.49915 4 2.49915H12C12.2761 2.49915 12.5 2.723 12.5 2.99915V4.99915C12.5 5.27001 12.2846 5.49057 12.0158 5.4989ZM4.21183 6.49915V9.4989H11.8032V6.49915H4.21183ZM4 10.5009C3.72386 10.5009 3.5 10.7247 3.5 11.0009V13.0009C3.5 13.277 3.72386 13.5009 4 13.5009H12C12.2761 13.5009 12.5 13.277 12.5 13.0009V11.0009C12.5 10.7247 12.2761 10.5009 12 10.5009H4Z"
      fill="currentColor"
    />
  </svg>
)

const IconAreaAuth = ({ className }: AreaIconProps) => (
  <svg className={className} viewBox="0 0 16 16" width={16} height={16} fill="none">
    <path
      d="M3.49414 9.97461H8.49414M3.49414 9.97461V11.9746H8.49414V9.97461M3.49414 9.97461V7.97461H8.49414V9.97461M10 5V3C10 1.89543 9.10457 1 8 1C6.89543 1 6 1.89543 6 3V5M3.47266 7L3.47266 12C3.47266 13.1046 4.36809 14 5.47266 14H10.4727C11.5772 14 12.4727 13.1046 12.4727 12V7C12.4727 5.89543 11.5772 5 10.4727 5L5.47266 5C4.36809 5 3.47266 5.89543 3.47266 7Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="bevel"
    />
  </svg>
)

const IconAreaStorage = ({ className }: AreaIconProps) => (
  <svg className={className} viewBox="0 0 16 16" width={16} height={16} fill="none">
    <path
      d="M12.9997 7.50869V5.60119L9.38151 2.00024H3.99967C3.44739 2.00024 2.99967 2.44796 2.99967 3.00024V5.99976M12.9645 5.58447L9.38004 2L9.38004 4.58447C9.38004 5.13676 9.82776 5.58447 10.38 5.58447L12.9645 5.58447ZM4.44135 5.99976H2.97363C2.42135 5.99976 1.97363 6.44747 1.97363 6.99976V11.9998C1.97363 13.1043 2.86906 13.9998 3.97363 13.9998H11.9736C13.0782 13.9998 13.9736 13.1043 13.9736 11.9998V8.50869C13.9736 7.95641 13.5259 7.50869 12.9736 7.50869H6.79396C6.53157 7.50869 6.27968 7.40556 6.09263 7.22153L5.14268 6.28692C4.95563 6.10289 4.70375 5.99976 4.44135 5.99976Z"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeLinejoin="bevel"
    />
  </svg>
)

const IconAreaRealtime = ({ className }: AreaIconProps) => (
  <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.85669 1.07837C6.13284 1.07837 6.35669 1.30223 6.35669 1.57837V4.07172C6.35669 4.34786 6.13284 4.57172 5.85669 4.57172C5.58055 4.57172 5.35669 4.34786 5.35669 4.07172V1.57837C5.35669 1.30223 5.58055 1.07837 5.85669 1.07837ZM1.51143 1.51679C1.70961 1.32449 2.02615 1.32925 2.21845 1.52743L4.3494 3.72353C4.5417 3.9217 4.53694 4.23825 4.33876 4.43055C4.14058 4.62285 3.82403 4.61809 3.63173 4.41991L1.50078 2.22381C1.30848 2.02564 1.31325 1.70909 1.51143 1.51679ZM5.10709 6.49114C4.74216 5.65659 5.59204 4.80844 6.42584 5.17508L14.3557 8.66199C15.2287 9.04582 15.1201 10.3175 14.1948 10.5478L11.1563 11.3041L10.4159 14.1716C10.1783 15.0916 8.91212 15.1928 8.53142 14.3222L5.10709 6.49114ZM13.9532 9.5774L6.02332 6.09049L9.44766 13.9216L10.2625 10.7658C10.3083 10.5882 10.4478 10.4499 10.6258 10.4056L13.9532 9.5774ZM1.04663 5.79688C1.04663 5.52073 1.27049 5.29688 1.54663 5.29688H3.99057C4.26671 5.29688 4.49057 5.52073 4.49057 5.79688C4.49057 6.07302 4.26671 6.29688 3.99057 6.29688H1.54663C1.27049 6.29688 1.04663 6.07302 1.04663 5.79688Z"
      fill="currentColor"
    />
  </svg>
)

const IconAreaEdgeFunctions = ({ className }: AreaIconProps) => (
  <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.62624 10.8978C1.22391 10.0142 1 9.03261 1 8C1 4.13401 4.13401 1 8 1C9.03686 1 10.0223 1.22575 10.9087 1.63122C11.2997 1.37784 11.766 1.23071 12.2665 1.23071C13.6473 1.23071 14.7665 2.35 14.7665 3.73071C14.7665 4.23073 14.6197 4.69646 14.3669 5.08716C14.7736 5.97467 15 6.96155 15 8C15 11.866 11.866 15 8 15C6.94896 15 5.95081 14.768 5.05508 14.3521C4.67477 14.5858 4.22715 14.7206 3.74805 14.7206C2.36733 14.7206 1.24805 13.6013 1.24805 12.2206C1.24805 11.7349 1.38656 11.2815 1.62624 10.8978ZM2 8C2 4.68629 4.68629 2 8 2C8.75898 2 9.48416 2.14069 10.1515 2.39715C9.90768 2.7831 9.76654 3.24042 9.76654 3.73071C9.76654 3.77457 9.76768 3.81815 9.76991 3.86145C9.22664 3.6288 8.62833 3.5 7.99994 3.5C5.51466 3.5 3.49994 5.51472 3.49994 8C3.49994 8.61006 3.62134 9.19177 3.8413 9.72228C3.81035 9.72115 3.77927 9.72058 3.74805 9.72058C3.24584 9.72058 2.77822 9.86866 2.38647 10.1235C2.13679 9.46389 2 8.74838 2 8ZM5.83493 13.5976C6.50608 13.8574 7.23593 14 8 14C11.3137 14 14 11.3137 14 8C14 7.23965 13.8588 6.51324 13.6015 5.84486C13.2152 6.08924 12.7574 6.23071 12.2665 6.23071C12.2232 6.23071 12.1802 6.22961 12.1374 6.22743C12.3707 6.77139 12.4999 7.3706 12.4999 8C12.4999 10.4853 10.4852 12.5 7.99994 12.5C7.37809 12.5 6.78569 12.3739 6.24695 12.1458C6.24768 12.1706 6.24805 12.1956 6.24805 12.2206C6.24805 12.7294 6.09603 13.2027 5.83493 13.5976ZM10.7665 3.73071C10.7665 2.90229 11.4381 2.23071 12.2665 2.23071C13.095 2.23071 13.7665 2.90229 13.7665 3.73071C13.7665 4.55914 13.095 5.23071 12.2665 5.23071C11.4381 5.23071 10.7665 4.55914 10.7665 3.73071ZM5.40407 10.3477C5.48532 10.4196 5.56185 10.4967 5.63315 10.5785C6.25623 11.1507 7.08729 11.5 7.99994 11.5C9.93294 11.5 11.4999 9.933 11.4999 8C11.4999 6.067 9.93294 4.5 7.99994 4.5C6.06695 4.5 4.49994 6.067 4.49994 8C4.49994 8.90336 4.84218 9.72678 5.40407 10.3477ZM3.74805 10.7206C4.11285 10.7206 4.44724 10.8508 4.70725 11.0673C4.77215 11.1369 4.83923 11.2045 4.90838 11.2699C5.12065 11.5287 5.24805 11.8598 5.24805 12.2206C5.24805 13.049 4.57647 13.7206 3.74805 13.7206C2.91962 13.7206 2.24805 13.049 2.24805 12.2206C2.24805 11.3921 2.91962 10.7206 3.74805 10.7206Z"
      fill="currentColor"
    />
  </svg>
)

const IconAreaOther = ({ className }: AreaIconProps) => (
  <svg className={className} width={16} height={16} viewBox="0 0 16 16" fill="none">
    <path
      d="M3.5 8H3.51M8 8H8.01M12.5 8H12.51M14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function AreaIcon({ icon }: { icon: (typeof areas)[number]['icon'] }) {
  const className = 'h-4 w-4'

  switch (icon) {
    case 'database':
      return <IconAreaDatabase className={className} />
    case 'auth':
      return <IconAreaAuth className={className} />
    case 'storage':
      return <IconAreaStorage className={className} />
    case 'realtime':
      return <IconAreaRealtime className={className} />
    case 'edge-functions':
      return <IconAreaEdgeFunctions className={className} />
    case 'other':
      return <IconAreaOther className={className} />
  }
}

const AreasNav = () => (
  <nav className="pt-8" aria-labelledby="community-docs-areas-heading">
    <div className="mb-4">
      <h2
        id="community-docs-areas-heading"
        className="text-xl font-medium tracking-[-0.03em] text-foreground"
      >
        Areas
      </h2>
      <p className="text-sm text-foreground-lighter">Browse community contributions by area.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {areas.map((area) => (
        <a
          key={area.label}
          className="group flex items-center gap-3 rounded-lg border bg-surface-75 p-4 text-sm font-medium text-foreground transition-colors hover:border-overlay-hover hover:bg-surface-100"
          href={`#${getAreaId(area.label)}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border bg-surface-100 text-brand transition-colors group-hover:border-overlay-hover">
            <AreaIcon icon={area.icon} />
          </span>
          {area.label}
        </a>
      ))}
    </div>
  </nav>
)

const CommunityDocCard = ({ page }: { page: CommunityDocSummary }) => (
  <Link className="group block h-full" href={`/${page.slug}`}>
    <Card className="h-full transition-colors group-hover:border-overlay-hover">
      <CardHeader>
        <CardTitle className="text-sm normal-case tracking-normal">
          {page.frontmatter.title}
        </CardTitle>
        <CardDescription>{page.frontmatter.description}</CardDescription>
      </CardHeader>
      {page.frontmatter.tags.length > 0 && (
        <CardContent className="flex flex-wrap gap-2 border-none">
          {page.frontmatter.tags.map((tag) => (
            <Badge key={tag} className={cn('normal-case tracking-normal')}>
              {tag}
            </Badge>
          ))}
        </CardContent>
      )}
    </Card>
  </Link>
)

const PopularCard = ({ pages }: { pages: CommunityDocSummary[] }) => {
  if (pages.length === 0) return null

  return (
    <aside className="rounded-xl border bg-surface-75 p-4 shadow-sm md:p-5 lg:-translate-y-8">
      <div className="mb-4">
        <h2 className="text-xl font-medium tracking-[-0.03em] text-foreground">Popular</h2>
        <p className="text-sm text-foreground-lighter">
          Start with highlighted community projects.
        </p>
      </div>

      <div className="grid gap-3">
        {pages.map((page) => (
          <Link
            key={page.slug}
            className="block rounded-lg border bg-surface-100 p-4 transition-colors hover:border-overlay-hover"
            href={`/${page.slug}`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-brand">{page.frontmatter.repo}</h3>
              <span className="shrink-0 rounded-full border px-2 py-0.5 text-xs text-foreground-light">
                {page.frontmatter.isTemplate ? 'Public template' : 'Public'}
              </span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-foreground-lighter">
              {page.frontmatter.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-foreground-lighter">
              {page.frontmatter.language && (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      'h-3 w-3 rounded-full',
                      languageColorByName[page.frontmatter.language] ?? 'bg-foreground-muted'
                    )}
                  />
                  {page.frontmatter.language}
                </span>
              )}
              <span>☆ {formatCount(page.frontmatter.stars)}</span>
              <span>⑂ {formatCount(page.frontmatter.forks)}</span>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  )
}

const SectionHeader = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h2 className="text-2xl font-medium tracking-[-0.03em] text-foreground">{title}</h2>
    <p className="text-sm text-foreground-lighter">{description}</p>
  </div>
)

const ClientLibraryLink = ({ name }: { name: string | null }) => {
  if (name === null) {
    return <span className="text-foreground-muted">Not listed</span>
  }

  return (
    <a
      className="font-medium text-brand transition-colors hover:text-brand-600"
      href={getClientLibraryUrl(name)}
      rel="noreferrer"
      target="_blank"
    >
      {name}
    </a>
  )
}

const ClientLibrariesSection = () => (
  <section id="client-libraries" className="scroll-mt-8 space-y-4 lg:scroll-mt-12">
    <SectionHeader
      title="Client Libraries"
      description="Select a language to see the Supabase client and feature clients from the community GitHub profile."
    />

    <Tabs_Shadcn_ defaultValue={clientLibraries[0].language} className="overflow-hidden rounded-xl border">
      <TabsList_Shadcn_ className="gap-5 overflow-x-auto border-0 border-b bg-surface-75 px-5">
        {clientLibraries.map((clientLibrary) => (
          <TabsTrigger_Shadcn_
            key={clientLibrary.language}
            value={clientLibrary.language}
            className="px-0 py-2.5 text-xs data-[state=active]:bg-transparent"
          >
            {clientLibrary.language}
          </TabsTrigger_Shadcn_>
        ))}
      </TabsList_Shadcn_>

      {clientLibraries.map((clientLibrary) => (
        <TabsContent_Shadcn_
          key={clientLibrary.language}
          value={clientLibrary.language}
          className="m-0 bg-surface-75 p-5 data-[state=inactive]:hidden"
          forceMount
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-medium tracking-[-0.03em] text-foreground">
                {clientLibrary.language}
              </h3>
              <p className="text-sm text-foreground-lighter">
                Libraries listed in the GitHub Client Libraries table.
              </p>
            </div>
            <span className="rounded-full border px-2 py-0.5 text-xs text-foreground-light">
              {clientLibrary.group}
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {clientLibraryFeatures.map((feature) => (
              <div key={feature} className="rounded-lg border bg-surface-100 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-foreground-lighter">
                  {feature}
                </p>
                <p className="mt-1 text-sm">
                  <ClientLibraryLink name={clientLibrary.libraries[feature]} />
                </p>
              </div>
            ))}
          </div>
        </TabsContent_Shadcn_>
      ))}
    </Tabs_Shadcn_>
  </section>
)

const SelfHostedSection = () => (
  <section id="self-hosted" className="scroll-mt-8 space-y-4 lg:scroll-mt-12">
    <SectionHeader
      title="Self-hosted"
      description="Community repositories for running Supabase in your own infrastructure."
    />

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {selfHostedProjects.map((project) => (
        <a
          key={project.name}
          className="block rounded-lg border bg-surface-100 p-4 transition-colors hover:border-overlay-hover"
          href={getCommunityRepoUrl(project.name)}
          rel="noreferrer"
          target="_blank"
        >
          <h3 className="text-sm font-medium text-brand">{project.name}</h3>
          <p className="mt-1 line-clamp-3 text-sm text-foreground-lighter">{project.description}</p>
        </a>
      ))}
    </div>
  </section>
)

const UtilitiesSection = () => (
  <section id="utilities" className="scroll-mt-8 space-y-4 lg:scroll-mt-12">
    <SectionHeader
      title="Utilities"
      description="Community utility projects grouped by the headings from the GitHub profile."
    />

    <div className="grid gap-4 md:grid-cols-2 md:items-start">
      {[0, 1].map((columnIndex) => (
        <div key={columnIndex} className="grid gap-4">
          {utilityGroups
            .filter((_, index) => index % 2 === columnIndex)
            .map((group) => (
              <div key={group.heading} className="rounded-lg border bg-surface-75 p-4">
                <h3 className="text-sm font-medium text-foreground">{group.heading}</h3>
                <div className="mt-3 grid gap-3">
                  {group.items.map((item) => (
                    <a
                      key={item.name}
                      className="block rounded-lg border bg-surface-100 p-4 transition-colors hover:border-overlay-hover"
                      href={getCommunityRepoUrl(item.name)}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <p className="text-sm font-medium text-brand">{item.name}</p>
                      {item.description && (
                        <p className="mt-1 text-sm text-foreground-lighter">{item.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  </section>
)

const CommunityDocsHome = ({ sections }: { sections: CommunityDocSection[] }) => {
  const { query } = useCommunityDocsSearch()

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return sections

    return sections
      .map((section) => ({
        ...section,
        pages: section.pages.filter((page) => {
          const { tags, title } = page.frontmatter

          return (
            title.toLowerCase().includes(normalizedQuery) ||
            tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
          )
        }),
      }))
      .filter((section) => section.pages.length > 0)
  }, [query, sections])

  const filteredPages = filteredSections.flatMap((section) => section.pages)
  const popularPages = [...filteredPages]
    .sort(
      (a, b) =>
        b.frontmatter.stars - a.frontmatter.stars ||
        b.frontmatter.forks - a.frontmatter.forks ||
        a.frontmatter.repo.localeCompare(b.frontmatter.repo)
    )
    .slice(0, 6)
  const resultCount = filteredSections.reduce((count, section) => count + section.pages.length, 0)

  return (
    <div>
      <div className="grid gap-8 pb-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:pb-0">
        <div className="max-w-2xl space-y-4 lg:pb-20">
          <h1 className="flex items-center gap-3 text-3xl font-medium tracking-[-0.04em] text-foreground md:text-4xl">
            <SupabaseMark className="h-8 w-8 text-foreground-lighter md:h-9 md:w-9" />
            <span>Supabase Community Docs</span>
          </h1>
          <p className="text-xl text-foreground-light">
            Community-built integrations, examples, and getting-started guides.
          </p>
          <AreasNav />
        </div>
        <PopularCard pages={popularPages} />
      </div>

      {filteredSections.length === 0 ? (
        <Card>
          <CardContent className="border-none py-8">
            <p className="text-sm text-foreground-light">
              {sections.length === 0
                ? 'No community docs have been generated yet. Run the content pipeline to create MDX files.'
                : `No community docs match "${query}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-12 pt-6 lg:pt-0">
          <ClientLibrariesSection />
          <SelfHostedSection />
          <UtilitiesSection />

          {filteredSections.map((section) => (
            <section
              id={getAreaId(section.category)}
              key={section.category}
              className="scroll-mt-8 space-y-4 lg:scroll-mt-12"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-medium tracking-[-0.03em] text-foreground">
                    {section.category}
                  </h2>
                  <p className="text-sm text-foreground-lighter">
                    {section.pages.length} {section.pages.length === 1 ? 'guide' : 'guides'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.pages.map((page) => (
                  <CommunityDocCard key={page.slug} page={page} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {sections.length > 0 && (
        <p className="text-sm text-foreground-lighter">
          Showing {resultCount} of{' '}
          {sections.reduce((count, section) => count + section.pages.length, 0)} guides
        </p>
      )}
    </div>
  )
}

export { CommunityDocsHome }

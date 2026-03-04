import nextra from 'nextra'

const withNextra = nextra({
  search: {
    codeblocks: false
  },
  contentDirBasePath: '/docs'
})

export default withNextra({
  basePath: '/help/en',
  reactStrictMode: true
})

/**
 * route
 */
export default [
  [/^mip\/archives$/, 'post/archive'],
  [/^mip\/cate\/(.+)$/, 'post/list?cate=:1'],
  [/^mip\/tag\/(.+)$/, 'post/list?tag=:1'],
  [/^mip\/author\/([^/]+)$/, 'post/list?name=:1'],
  [/^mip\/tags$/, 'post/tag'],
  [/^mip\/links$/, 'post/page?pathname=links'],
  [/^mip\/search$/, 'post/search'],
  [/^mip\/page\/([^/]+)$/, 'post/page?pathname=:1'],
  [/^mip\/post\/([^/]+)$/, 'post/detail?pathname=:1']
];

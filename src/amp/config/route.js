/**
 * route
 */
export default [
  [/^amp\/archives$/, 'post/archive'],
  [/^amp\/cate\/(.+)$/, 'post/list?cate=:1'],
  [/^amp\/tag\/(.+)$/, 'post/list?tag=:1'],
  [/^amp\/author\/([^/]+)$/, 'post/list?name=:1'],
  [/^amp\/tags$/, 'post/tag'],
  [/^amp\/links$/, 'post/page?pathname=links'],
  [/^amp\/search$/, 'post/search'],
  [/^amp\/page\/([^/]+)$/, 'post/page?pathname=:1'],
  [/^amp\/post\/([^/]+)$/, 'post/detail?pathname=:1']
];

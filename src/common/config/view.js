import {parse} from 'url';
import buildImg from '../util/buildImg';
import buildUrl from '../util/buildUrl';

const build_query = obj => '?' +
  Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');
/**
 * template config
 */
export default {
  type: 'nunjucks',
  content_type: 'text/html',
  file_ext: '.html',
  file_depr: '_',
  root_path: think.ROOT_PATH + '/view',
  adapter: {
    nunjucks: {
      trimBlocks: true,
      lstripBlocks: true,
      prerender: function(nunjucks, env) {
        env.addFilter('buildMipImg', content => {
          return buildImg.mip(content || '');
        });

        env.addFilter('buildAmpImg', content => {
          return buildImg.amp(content || '');
        });

        env.addFilter('buildLazyImg', content => {
          return buildImg.lazy(content || '');
        });

        env.addFilter('buildAmpUrl', (content, prefix) => {
          return buildUrl.amp(content, prefix);
        });

        env.addFilter('buildMipUrl', (content, prefix) => {
          return buildUrl.mip(content, prefix);
        });

        env.addFilter('buildImgToWebp', (content, isWebp) => {
          return buildImg.toWebp(content, isWebp);
        });

        env.addFilter('buildImgToWebpUrl', (url, isWebp) => {
          return buildImg.toWebpUrl(url, isWebp);
        });

        env.addFilter('utc', time => (new Date(time)).toUTCString());
        env.addFilter('pagination', function(page) {
          let {pathname, query} = parse(this.ctx.http.url, true);

          query.page = page;
          return pathname + build_query(query);
        });

        env.addFilter('xml', str => {
          let NOT_SAFE_IN_XML = /[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm;
          return str.replace(NOT_SAFE_IN_XML, '');
        });
      }
    }
  }
};

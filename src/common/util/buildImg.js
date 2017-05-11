const placeholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default {
  mip(content) {
    return content.replace(/<img\s+(.+?)\/?>/g, '<mip-img layout="responsive" $1></mip-img>');
  },

  amp(content) {
    return content.replace(/<img\s+(.+?)\/?>/g, '<amp-img layout="responsive" $1></amp-img>');
  },

  lazy(content) {
    return content.replace(/<img\s+src="([^"]+)"\s*(.*?)width="(\d+)"\s+height="(\d+)"\/?>/g, (all, src, alt, width, height) => {
      return `<div class="img" style="width: ${width}px;"><i style="padding-bottom: ${height / width * 100}%"></i><img src="${placeholder}" data-src="${src}" class="lazy-load"></div>`;
    });
  },

  toWebp(content, isWebp) {
    const imgstr = isWebp ? 'imageMogr2/format/webp' : 'imageslim';
    return content.replace(/<img\s+(.*?)src="([^"]+)"/g, (all, $0, src) => {
      return `<img src="${src}?${imgstr}" ${$0}`;
    });
  },

  toWebpUrl(url, isWebp) {
    const imgstr = isWebp ? 'imageMogr2/format/webp' : 'imageslim';
    return `${url}?${imgstr}`;
  }
};
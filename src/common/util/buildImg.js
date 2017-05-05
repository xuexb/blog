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
    return isWebp ? 
      content.replace(/<img\s+(.*?)src="([^"]+)"/g, (all, $0, src) => {
        if (String(src).indexOf('?imageMogr2/format/webp') === -1) {
          all = `<img src="${src}?imageMogr2/format/webp" ${$0}`;
        }
        return all;
      })
      : content;
  },

  toWebpUrl(url, isWebp) {
    if (isWebp && String(url).indexOf('?imageMogr2/format/webp') === -1) {
      url = `${url}?imageMogr2/format/webp`;
    }
    return url;
  }
};
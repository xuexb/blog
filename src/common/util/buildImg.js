const placeholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default {
  mip(content) {
    return content.replace(/<img\s+(.+?)\/?>/g, '<mip-img layout="responsive" $1></mip-img>');
  },

  amp(content) {
    return content.replace(/<img\s+(.+?)\/?>/g, '<amp-img layout="responsive" $1></amp-img>');
  },

  lazy(content) {
    return content.replace(/<img\s+src="([^"]+)"\s*(.*?)\/?>/g, (all, src, alt) => {
      return `<img class="lazy-load" src="${placeholder}" data-src="${src}" ${alt}>`;
    })
  }
};
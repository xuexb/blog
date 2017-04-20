export default {
  amp(content, prefix = '') {
    return content.replace(/href="(?:https?:\/\/(www\.)?xuexb\.com\/|\/)(|[^\/].*?)"/gi, ($0, $1, $2) => {
      return `href="${prefix}/${$2}"`;
    });
  }
};

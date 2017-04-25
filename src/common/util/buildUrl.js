const mipReg = /<a\s+(.*?)href="(?:https?:\/\/(www\.)?xuexb\.com\/?|\/)(|[^\/].*?)"\s*(.*?)>([\s\S]+?)<\/a>/gi;
const ampReg = /href="(?:https?:\/\/(www\.)?xuexb\.com\/?|\/)(|[^\/].*?)"/gi;

export default {
    amp(content, prefix = '') {
        return content.replace(ampReg, ($0, $1, pathname) => {
            return `href="${prefix}/${pathname}"`;
        });
    },

    mip(content, prefix = '') {
        return content.replace(mipReg, ($0, $1, url, pathname, placeholder, text) => {
            text = String(text || '').replace(/[\n\r]\s*/g, '').trim();
            return `<mip-link href="${prefix}/${pathname}" title="${text}">${text}</mip-link>`;
        });
    }
};

/**
 * 图片占位符
 *
 * @type {tring}
 */
const placeholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default {
    /**
     * 输出主站带有占位+延迟加载的img标签
     *
     * @param  {string} content 内容
     *
     * @return {string}
     */
    lazy(content) {
        return content.replace(/<img\s+src="([^"]+)"\s*(.*?)width="(\d+)"\s+height="(\d+)"\/?>/g, (all, src, alt, width, height) => {
            return `<div class="img" style="width: ${width}px;"><i style="padding-bottom: ${height / width * 100}%"></i><img src="${placeholder}" data-src="${src}" class="lazy-load"></div>`;
        });
    },

    /**
     * 内容里图片链接转webp或者七牛图片压缩
     *
     * @param  {string}  content 内容
     * @param  {boolean} isWebp  是否支持webp
     *
     * @return {string}
     */
    toWebp(content, isWebp) {
        const imgstr = isWebp ? 'imageMogr2/format/webp' : 'imageslim';
        return content.replace(/<img\s+(.*?)src="([^"]+)"/g, (all, $0, src) => {
            return `<img src="${src}?${imgstr}" ${$0}`;
        });
    },

    /**
     * 图片链接转webp或者七牛图片压缩
     *
     * @param  {string}  url 链接
     * @param  {boolean} isWebp  是否支持webp
     *
     * @return {string}
     */
    toWebpUrl(url, isWebp) {
        const imgstr = isWebp ? 'imageMogr2/format/webp' : 'imageslim';
        return `${url}?${imgstr}`;
    }
};

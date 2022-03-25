/**
 * 图片占位符
 *
 * @type {tring}
 */
const placeholder = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

/**
 * 图片匹配正则，需要结合后台上传图片生成的规则
 * 
 * @type {RegExp}
 */
const reg_img = /<img\s+src="([^"]+)"\s*(.*?)width="(\d+)"\s+height="(\d+)"\/?>/g;

export default {
    /**
     * 输出主站带有占位+延迟加载的img标签
     *
     * @param  {string} content 内容
     *
     * @return {string}
     */
    lazy(content) {
        return content.replace(reg_img, (all, src, alt, width, height) => {
            return [
                `<div class="img" style="width: ${width}px;">`,
                    `<i style="padding-bottom: ${height / width * 100}%"></i>`,
                    `<img width=${width} height=${height} src="${placeholder}" data-src="${src}" class="lazy-load" ${alt}>`,
                '</div>'
            ].join('');
        });
    },
};

'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
    /**
     * 初始化
     *
     * @param  {Object} http http
     */
    init(...args) {
        // 调用父类的init方法 
        super.init(...args);
    }

    /**
     * 保存文章
     *
     * @return {[type]} [description]
     */
    saveArticleAction(){

        if(!this.isPost()){
            return this.fail('method error');
        }

        // 检查内容是否包含列表标识
        if(this.post('content').indexOf(think.config('blog.list_mark')) === -1){
            return this.fail('必须包含列表提取字段～');
        }


        let rules = {
            title: 'required|string',
            list_id: 'required|int',
            content: 'required|string',
            hit: 'int|default:0'
        }

        let flag = this.validate(rules);

        if (!flag) {
            return this.fail('validate error', this.errors());
        }
    }

    /**
     * 保存标签
     *
     * @return {[type]} [description]
     */
    saveTagsAction() {

        if(!this.isPost()){
            return this.fail('method error');
        }

        let rules = {
            name: 'required|string',
            hit: 'int|default:0'
        }

        let flag = this.validate(rules);

        if (!flag) {
            return this.fail('validate error', this.errors());
        }
    }

    /**
     * 删除标签
     *
     * @return {Proimise} []
     */
    delTagsAction() {
        let rules = {
            id: 'int:1'
        }

        let flag = this.validate(rules);

        if (!flag) {
            return this.fail('validate error', this.errors());
        }
    }
}

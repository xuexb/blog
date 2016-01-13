# xiaowu blog 3.x for thinkjs 2.x

## sql cache list

* `new_article_data` 最新文章列表top6
* `list_data` 列表数据
* `search_hit_data` 搜索排行top6
* `rand_tags_list_data` 随机标签列表top20

## web hook

当最后一个`git commit -m {message}`的信息带有`[blog compile]`时，会自动线上编译并重启`node`
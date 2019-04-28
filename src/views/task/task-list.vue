<template>
    <div class="app-container">
        <div class="filter-container">
            <el-autocomplete
                style="width:200px"
                class="filter-item"
                v-model="selection.task_creator"
                :fetch-suggestions="loadUsers"
                :trigger-on-focus="false"
                placeholder="创建者"
                @select="selectSearchUser"
                clearable
            ></el-autocomplete>
            <el-select class="filter-item" v-model="selection.task_status" placeholder="任务状态" style="width:110px">
                <el-option v-for="item in task_status_options" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="toSearch">Search</el-button>

            <el-button class="filter-item" type="primary" @click="multiPublish(1)" icon="el-icon-upload">任务发布</el-button>
            <el-button class="filter-item" @click="multiPublish(0)"><svg-icon icon-class="cancel"/> 任务下线</el-button>
        </div>

        <el-table border v-loading="loading" element-loading-text="拼命加载中..." style="width: 100%" :data="tasks" tooltip-effect="dark" @selection-change="handleCheckAll">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column prop="id" label="ID" width="50"></el-table-column>
            <el-table-column prop="schedule_name" label="任务名">
                <template slot-scope="scope" class="cf-text">
                    <router-link class="cf-text" :to="{name:'TaskEdit', params: {id: scope.row.id}}">
                        <i class="el-icon-edit"></i>
                        <span>{{ scope.row.schedule_name }}</span>
                    </router-link>
                </template>
            </el-table-column>
            <el-table-column prop="schedule_desc" label="任务描述"></el-table-column>
            <el-table-column prop="created_at" label="创建时间" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{ scope.row.created_at }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updated_at" label="最后修改时间" sortable>
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{ scope.row.updated_at }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="created_by" label="创建人">
                <template slot-scope="scope">
                    <span>{{ scope.row.created_by }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updated_by" label="最后修改人">
                <template slot-scope="scope">
                    <span>{{ scope.row.updated_by }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <template v-if="scope.row.is_publish == 1">
                        <el-button type="danger" icon="el-icon-delete" circle title="删除" @click="publishOrUnPublish(scope.row, 0)"></el-button>
                    </template>
                    <template v-else>
                        <el-button type="primary" icon="el-icon-upload" circle title="发布" @click="publishOrUnPublish(scope.row, 1)"></el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="pagination.total > 0"
            :background="pagination.background"
            :layout="pagination.layout"
            :total="pagination.total"
            :pageSizes="pagination.page_size_selection"
            :page.sync="pagination.page"
            :limit.sync="pagination.page_size"
            @pagination="loadList" />
    </div>
</template>

<script>
    import qs from 'qs';
    import Cookie from 'js-cookie';

    import Pagination from '@components/pagination';

    export default {
        name: "task-list",
        components: {
            Pagination
        },
        data() {
            return {
                task_status_options: [  // task status options
                    { label:'无', value:'' },
                    { label:'未发布', value:'0' },
                    { label:'已发布', value:'1' },
                ],
                pagination: {   // pagination config
                    page: 1,
                    total: 20,
                    page_size_selection: [10, 20, 30],
                    layout: 'total, sizes, prev, pager, next',
                    page_size: 10,
                    background: false,
                },
                users: [],
                selection: {},  // task filter selection
                check_all: false,   // check all
                checked_tasks: [],  // already checked task
                loading: true,
                tasks: null,
            }
        },
        methods: {
            toSearch(){
                this.loadList();
            },
            async loadUsers(keyword, callback) {
                let suggestion = [];
                await this.$http.get("/staff", {
                    params: {
                        keyword: keyword
                    }
                }).then(response => {
                    if (response.data.errno === 0) {
                        window._.forEach(response.data.data.list, function (value, key) {
                            suggestion[key] = {
                                value: value["name"] + "-" + value["ldap"]  ,
                                name: value["name"],
                                ldap: value["ldap"],
                                email: value["email"]
                            }
                        });
                        callback(suggestion);
                    }
                });
                this.users = suggestion;
            },
            selectSearchUser(item){
                this.selection.task_creator = item["ldap"];
            },
            handleSizeChange(size) {
                Cookie.set('task_page_size', size, { expires: 365 });
                this.pagination.page_size = size;
                this.loadList();
            },
            handleCurrentChange(page) {
                this.pagination.page = page;
                this.loadList();
            },
            handleCheckAll(item) {
                if (item.length === 0) {
                    this.checked_tasks = [];
                } else {
                    let that = this;
                    this.checked_tasks = [];
                    window._.forEach(item, function (value, index) {
                        that.checked_tasks[index] = value.id
                    });
                }
            },
            realPublishOrUnPublish(ids, action) {
                if (ids.length <= 0) {
                    return false;
                }
                let url = '/task/publish';
                if (action === 0) {
                    url = '/task/un-publish';
                }
                return this.$http.post(url, qs.stringify({id: ids.join(',')}) ).then(callback => {
                    const data = callback.data;
                    if (data.errno === 0) {
                        this.$notify.success('操作成功');
                        setTimeout(() => {
                            this.$router.go(0)
                        }, 800);
                    } else {
                        this.$notify.error('操作失败，请重试~');
                    }
                }).catch();
            },
            publishOrUnPublish (item, action) {
                let actionName = "下线";
                if (action == 1) {
                    actionName = "发布";
                }

                if (item.is_publish == action) {
                    this.$notify.warning('已经'+actionName+'了，无需再次'+actionName+'!~');
                }

                this.$confirm('确认要'+actionName+' `'+item.schedule_name+'` 任务吗?', '提示', {
                        confirmButtonText: '确认',
                        cancelButtonText: '取消',
                        type: 'info'
                }).then(() => {
                    let result = this.realPublishOrUnPublish([item.id], action);
                    if (!result) {
                        this.$notify.error("请选择要"+actionName+"的任务!~");
                    }
                }).catch(() => {});
            },
            multiPublish(action) {
                let actionName = "下线";
                if (action == 1) {
                    actionName = "发布";
                }

                if (this.checked_tasks.length <= 0) {
                    this.$notify.warning('请至少选择一个要'+actionName+'的任务',);
                    return
                }

                this.$confirm('确认要'+actionName+'这 '+ this.checked_tasks.length +' 个任务吗?', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let result = this.realPublishOrUnPublish(this.checked_tasks, action);
                    if (!result) {
                        this.$notify.error("请选择要"+actionName+"的任务!~");
                    }
                });
            },
            showLoading() {
                this.loading = true;
                // loading
                setTimeout(() => {
                    this.loading = false;
                }, 800);
            },
            loadList() {
                this.showLoading();
                this.$http.get('/task/list', {
                    params : window._.merge({
                        page: this.pagination.page,
                        size: this.pagination.page_size,
                    }, this.selection),
                }).then(
                    response => {
                        let data = response.data;
                        if (data.errno === 0) {
                            this.tasks = data.data.list;
                            this.pagination.total = data.data.count;
                        } else {
                            if (data.errmsg !== undefined) {
                                this.$notify.error(data.errmsg);
                            } else {
                                this.$notify.error('请求任务失败!~');
                            }
                        }
                    }
                );
            }
        },
        created(){
            let pageSize = Cookie.get('task_page_size');
            if (pageSize !== undefined) {
                this.pagination.page_size = parseInt(pageSize);
            }
            this.loadList();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .app-container{
        .filter-container{
            .filter-item{
                margin-right:5px;
            }
        }
    }
    .cf-text {
        color: #606266;
        text-decoration: none;
        cursor: pointer;
    }
    .cf-text:hover {
        color: #409EFF;
        text-decoration: underline;
    }

</style>

<template>
    <div class="app-container">
        <el-row type="flex" justify="start">
            <el-col :span="18" class="form-filter left-border">
                <div class="block-title"><span>基本信息</span></div>
            </el-col>
            <el-col :span="6" class="form-filter more-filter">
                <el-dropdown split-button type="primary" size="small" @command="moreSet">
                    更多设置
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="Permission" v-if="task.has_permission">权限设置</el-dropdown-item>
                        <el-dropdown-item command="Permission" v-else disabled>权限设置</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <p class="separate"></p>
        <el-row type="flex">
            <el-col :span="24">
                <el-form class="task-form col" ref="form" :model="task" label-width="80px">
                    <el-form-item class="col-md-6" label="任务名称: ">
                        <el-input v-model="task.name" clearable prefix-icon="el-icon-edit-outline"></el-input>
                    </el-form-item>
                    <el-form-item class="col-md-6" label="任务描述: ">
                        <el-input type="textarea" v-model="task.desc"></el-input>
                    </el-form-item>
                    <el-form-item class="col-md-6" label="任务命令: ">
                        <el-input v-model="task.command" clearable prefix-icon="el-icon-bell"></el-input>
                    </el-form-item>
                    <el-form-item class="col-md-6" label="是否并行: ">
                        <el-switch v-model="task.is_parallel"></el-switch>
                    </el-form-item>
                    <el-form-item class="col-md-6" label="并行个数: ">
                        <el-input-number v-model="task.parallel_num" controls-position="right" :min="1" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item class="col-md-6" label="工作目录: ">
                        <el-input v-model="task.work_place" clearable prefix-icon="el-icon-view"></el-input>
                    </el-form-item>
                    <el-form-item class="col-md-6" label="执行机器: ">
                        <el-tooltip class="item" effect="dark" content="都不选，默认在所有机器上都可执行" :hide-after="1000" placement="right">
                            <el-select
                                    @change="selectMachine"
                                    v-model="task.run_at"
                                    multiple
                                    default-first-option
                                    placeholder="请选择执行的机器">
                                <el-option
                                        v-for="item in machines"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-tooltip>&nbsp;
                    </el-form-item>
                    <el-form-item class="col-md-6" id="configure-schema" label="配置:">
                        <el-button type="text" @click="config_dialog = true"><i class="el-icon-edit-outline"></i> 点击编辑</el-button>
                    </el-form-item>

                    <!-- 配置dialog -->
                    <el-dialog id="config-box" title="配置" :visible.sync="config_dialog" center>
                        <div class="col-md-10">
                            <el-form :model="task.configure">
                                <el-form-item label="second （秒）：" :label-width="dialog_width">
                                    <el-input autocomplete="off" v-model="task.configure.seconds" placeholder="0-59"></el-input>
                                </el-form-item>
                                <el-form-item label="minute （分钟）" :label-width="dialog_width">
                                    <el-input autocomplete="off" v-model="task.configure.minutes" placeholder="0-59"></el-input>
                                </el-form-item>
                                <el-form-item label="hour （小时）：" :label-width="dialog_width">
                                    <el-input autocomplete="off" v-model="task.configure.hours" placeholder="0—23(0表示子夜)"></el-input>
                                </el-form-item>
                                <el-form-item label="day （日）：" :label-width="dialog_width">
                                    <el-input autocomplete="off" v-model="task.configure.days" placeholder="1—31"></el-input>
                                </el-form-item>
                                <el-form-item label="month （月）：" :label-width="dialog_width">
                                    <el-input autocomplete="off" v-model="task.configure.months" placeholder="1—12"></el-input>
                                </el-form-item>
                                <el-form-item label="week （周）：" :label-width="dialog_width">
                                    <el-input autocomplete="off" v-model="task.configure.weeks" placeholder="0—6(0表示周日，1表示周一)"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>

                        <div slot="footer" class="dialog-footer">
                            <el-button type="primary" @click="config_dialog = false">确 定</el-button>
                            <el-button @click="config_dialog = false">取 消</el-button>
                        </div>
                    </el-dialog>
                    <!-- 配置dialog结束 -->

                    <!-- 权限dialog -->
                    <el-dialog id="permission-box" width="30%" title="权限设置" :visible.sync="permission_dialog" center>
                        <div class="col-md-10">
                            <el-form :model="task.configure">
                                <el-autocomplete
                                        class="inline-input"
                                        v-model="permission_search"
                                        :fetch-suggestions="permissionQuery"
                                        placeholder="请输入内容"
                                        :trigger-on-focus="false"
                                        @select="permissionSelect"
                                        clearable
                                ></el-autocomplete>
                            </el-form>

                            <el-table :data="permission" style="width: 100%" height="250">
                                <el-table-column fixed prop="date" label="日期" width="200"></el-table-column>
                                <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                                <el-table-column prop="name" label="操作" width="120">
                                    <template slot-scope="scope">
                                        <el-button
                                                @click.native.prevent="deletePermission(scope)"
                                                type="text"
                                                size="small">
                                            移除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                    </el-dialog>
                    <!-- 权限dialog结束 -->

                    <p class="separate"></p>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import qs from 'qs';
    import moment from 'moment';

    export default {
        name: "task-detail",
        data() {
            return {
                machines: [],
                config_dialog: false,
                permission_dialog: false,
                dialog_width: '200px',
                task: {
                    id : '',
                    name: '',
                    desc: '',
                    command: '/home/xiaoju/php7/bin/php -c php7.ini script.php ',
                    is_parallel: false,
                    parallel_num: 1,
                    work_place: '/home/xiaoju/asyncsvr',
                    run_at: [],
                    configure: {
                        seconds : '',
                        minutes : '',
                        hours : '',
                        days : '',
                        months : '',
                        weeks : ''
                    },
                    has_permission: false,
                },
                // 权限设置
                permission: [],
                permission_search: "",
                permission_suggestion: [{value:"",name:"",ldap:"",email:""}],
            }
        },
        methods: {
            // 后续有其他相关的操作，都可以放在这个button里面
            moreSet(command) {
                switch(command) {
                    case "Permission":
                        this.setPermission();
                        break;
                }
            },
            setPermission() {
                this.loadPermissionUser();
                this.permission_dialog = true;
            },
            async loadPermissionUser() {
                if (this.permission.length <= 0) {
                    await this.$http.get("/task/permission", {
                        params : {
                            task_id : parseInt(this.task.id)
                        }
                    }).then((response) => {
                        if (response.data.errno === 0) {
                            let permission = [];
                            window._.forEach(response.data.data.list, function (value, key) {
                                permission[key] = {date: value["created_at"], name: value["user_name"]};
                            });
                            this.permission = permission;
                        }
                    });
                }
            },
            permissionSelect(item) {
                // 检查是否存在
                let isExists = false;
                window._.forEach(this.permission, function (value) {
                    if (value["name"] === item["ldap"]) {
                        isExists = true;
                    }
                });
                if (isExists === true) {
                    this.$message.warning(item["ldap"]+'已经添加~');
                    return
                }
                let that = this;
                let currentPermission = {
                    date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    name:item["ldap"],
                };
                this.$http.post("/task/permission/create", qs.stringify({
                    "task_id": this.task.id,
                    "user_name": currentPermission.name
                })).then((response) => {
                    if (response.data.errno === 0) {
                        that.permission.push(currentPermission);
                        this.$notify.success("添加成功~");
                    }
                });
            },
            async permissionQuery(queryString, callback) {
                await this.$http.get("/staff", {
                    params: {
                        keyword: queryString
                    }
                }).then((response) => {
                    if (response.data.errno === 0) {
                        let suggestion = [];
                        window._.forEach(response.data.data.list, function (value, key) {
                            suggestion[key] = {
                                value: value["name"] + "-" + value["ldap"]  ,
                                name: value["name"],
                                ldap: value["ldap"],
                                email: value["email"]
                            }
                        });
                        this.permission_suggestion = suggestion;
                        callback(suggestion);
                    }
                });
            },
            deletePermission(scope) {
                // 后端删除
                if (this.permission.length <= 1) {
                    this.$message.error("至少要保留一个授权用户~")
                } else {
                    this.$http.post("/task/permission/update", qs.stringify({
                        task_id: this.task.id,
                        user_name: scope.row.name,
                    })).then((response) => {
                        if (response.data.errno === 0) {
                            this.$notify.success("Success~");
                            this.permission.splice(scope.$index, 1);
                        } else {
                            this.$message.error("删除失败~")
                        }
                    });
                }
            },
            selectMachine(value) {
                this.task.run_at = value;
            },
            onSubmit() {
                // 提交 task
                let taskId = this.$route.params.id !== undefined ? parseInt(this.$route.params.id) : 0
                let url = "/task/create";
                let params = {};
                if (taskId != 0) {
                    params.id = taskId;
                    url = "/task/update";
                }
                if (this.task.name == "" || this.task.desc == "" || this.task.command == "" || this.task.work_place == "") {
                    this.$notify.error("请填写完整的任务信息~");
                    return
                }
                params.schedule_name = this.task.name;
                params.schedule_desc = this.task.desc;
                params.schedule_command = this.task.command;
                params.work_place = this.task.work_place;
                params.is_parallel = this.task.is_parallel == true ? 1 : 0;
                params.parallel_num = this.task.parallel_num;
                params.schedule_configure = JSON.stringify(this.task.configure);
                let machines = [];
                if (this.task.run_at.length <= 0) {
                    window._.forEach(this.machines, function (value, key) {
                        machines[key] = value.value
                    })
                } else {
                    machines = this.task.run_at
                }
                params.run_machines = JSON.stringify(machines);

                this.$http.post(url, qs.stringify(params)).then(response => {
                    let data = response.data;
                    if (data.errno == 0) {
                        this.$notify.success("Success~");
                        setTimeout(() => {
                            this.$router.replace('/task/index')
                        }, 800);
                    } else {
                        this.$notify.success("编辑失败~")
                    }
                });
            },
            loadTask(){
                if (this.$route.params.id !== undefined) {
                    // 获取配置
                    this.$http.get('/task/detail', {
                        params : {
                            id : parseInt(this.$route.params.id)
                        }
                    }).then(
                        response => {
                            let data = response.data;
                            if (data.errno !== 0) {
                                this.$message.error("加载任务失败，工程师哥哥正在紧急恢复!!~");
                                return
                            }
                            let detail = data.data.data;
                            this.task.id = detail.id;
                            this.task.name = detail.schedule_name;
                            this.task.desc = detail.schedule_desc;
                            this.task.command = detail.schedule_command;
                            this.task.is_parallel = !!parseInt(detail.is_parallel);
                            this.task.parallel_num = detail.parallel_num;
                            this.task.work_place = detail.work_place;
                            this.task.configure = detail.schedule_configure;
                            this.task.run_at = detail.run_machines;
                            this.task.has_permission = data.data.has_permission;
                        }
                    );
                }
            },
            loadMachines() {
                let that = this;
                this.$http.get('/task/machine').then(response => {
                    let data = response.data;
                    if (data.errno != 0) {
                        this.$message.error("读取可执行机器配置失败~!");
                        return
                    }
                    let machinesArr = data.data.data;
                    let machines = [];
                    window._.forEach(machinesArr, function (value, key) {
                        machines[key] = {"value": value};
                    });
                    that.machines = machines;
                })
            }
        },
        mounted() {
            // load
            this.loadTask();
            this.loadMachines();
        }
    }
</script>

<style scoped>
    .separate {
        border-bottom: 1px solid #eee;
    }
    .el-row {
        margin-bottom: 15px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .left-border {
        border-left: 2px solid #ddd;
    }
    .form-filter {
        background: #fbfbfb;
        padding: 10px 10px;
        font-size: 16px;
    }
    .more-filter {
        text-align: right;
    }
</style>

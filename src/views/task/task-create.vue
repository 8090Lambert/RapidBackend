<template>
    <div class="app-container">
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

    export default {
        name: "task-create",
        data() {
            return {
                machines: [],
                config_dialog: false,
                dialog_width: '200px',
                task: {
                    id : '',
                    name: '',
                    desc: '',
                    command: '/usr/local/php7/bin/php -c php7.ini script.php ',
                    is_parallel: false,
                    parallel_num: 1,
                    work_place: '/home/www/',
                    run_at: [],
                    configure: {
                        seconds : '',
                        minutes : '',
                        hours : '',
                        days : '',
                        months : '',
                        weeks : ''
                    },
                },
            }
        },
        methods: {
            selectMachine(value) {
                this.task.run_at = value;
            },
            onSubmit() {
                // 提交 task
                let url = "/task/create";
                let params = {};
                if (this.task.name === "" || this.task.desc === "" || this.task.command === "" || this.task.work_place === "") {
                    this.$notify.error("请填写完整的任务信息~");
                    return
                }
                params.id = 0;
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
                    if (data.errno === 0) {
                        this.$notify.success("Success~");
                        setTimeout(() => {
                            this.$router.replace('/task/index')
                        }, 800);
                    } else {
                        this.$notify.success("编辑失败~")
                    }
                });
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
</style>

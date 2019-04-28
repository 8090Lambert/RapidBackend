<template>
    <div class="dashboard-container">
        <el-row :gutter="40" class="panel-group">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-people">
                        <svg-icon icon-class="peoples" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">Visits</div>
                        <span class="card-panel-num">6</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-schedule">
                        <svg-icon icon-class="schedule" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">Schedule Task</div>
                        <span class="card-panel-num">42</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-email">
                        <svg-icon icon-class="email" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">Email</div>
                        <span class="card-panel-num">4</span>
                    </div>
                </div>
            </el-col>
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-role">
                        <svg-icon icon-class="role" class-name="card-panel-icon" />
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">Permissions</div>
                        <span class="card-panel-num">2</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "dashboard",
        data() {
            return {
                task:0,
                permissions:0,
                visitor:0
            }
        },
        methods: {
            async loadDashboard(){
                let that = this;
                await this.$http.get('/dashboard').then(response => {
                    if (response.data.errno === 0) {
                        that.task = response.data.data.task;
                        that.permissions = response.data.data.permissions;
                        that.permissions = response.data.data.visitor;
                    }
                });
            }
        },
        created(){
            this.loadDashboard();
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dashboard-container {
        min-height: 750px;
        padding: 50px 32px;
        background-color: rgb(240, 242, 245);
    }
    .panel-group {
        margin-top: 18px;
        .card-panel-col{
            margin-bottom: 32px;
        }
        .card-panel {
            height: 108px;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #fff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);
            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }
                .icon-people {
                    background: #40c9c6;
                }
                .icon-schedule {
                    background: #36a3f7;
                }
                .icon-role {
                    background: #f4516c;
                }
                .icon-email {
                    background: #34bfa3
                }
            }
            .icon-people {
                color: #40c9c6;
            }
            .icon-schedule {
                color: #36a3f7;
            }
            .icon-role {
                color: #f4516c;
            }
            .icon-email {
                color: #34bfa3
            }
            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }
            .card-panel-icon {
                float: left;
                font-size: 48px;
            }
            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;
                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
    }
</style>

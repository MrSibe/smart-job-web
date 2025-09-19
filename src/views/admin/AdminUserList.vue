<template>
  <div class="admin-user-list">
    <div class="header">
      <h2>用户管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <el-card>
      <div class="filter-container">
        <el-input
          v-model="listQuery.phone"
          placeholder="手机号"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleFilter"
        />
        <el-input
          v-model="listQuery.nickname"
          placeholder="昵称"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleFilter"
        />
        <el-select
          v-model="listQuery.status"
          placeholder="状态"
          style="width: 120px; margin-right: 10px"
          clearable
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
        <el-button type="primary" @click="handleFilter">
          搜索
        </el-button>
        <el-button @click="resetFilter">
          重置
        </el-button>
      </div>

      <el-table
        :data="userList"
        v-loading="loading"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="角色" width="150">
          <template #default="{ row }">
            <el-tag
              v-for="role in row.roles"
              :key="role"
              style="margin-right: 5px; margin-bottom: 5px"
            >
              {{ role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 1 ? 'danger' : 'success'"
              @click="handleStatusChange(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getUserList"
          @current-change="getUserList"
        />
      </div>
    </el-card>

    <!-- 用户编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="userForm.phone"
            placeholder="请输入手机号"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="userForm.nickname"
            placeholder="请输入昵称"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="userForm.roleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

const loading = ref(false)
const userList = ref([])
const total = ref(0)
const roleOptions = ref([])

const listQuery = reactive({
  page: 1,
  limit: 10,
  phone: '',
  nickname: '',
  status: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const userFormRef = ref()

const userForm = reactive({
  id: null,
  phone: '',
  nickname: '',
  email: '',
  password: '',
  status: 1,
  roleIds: []
})

const userRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => {
  return isEdit.value ? '编辑用户' : '新增用户'
})

onMounted(() => {
  getUserList()
  getRoleOptions()
})

const getUserList = async () => {
  loading.value = true
  try {
    const response = await request.get('/users', { params: listQuery })
    if (response.code === '200') {
      userList.value = response.data
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const getRoleOptions = async () => {
  try {
    const response = await request.get('/roles/simple-list')
    if (response.code === '200') {
      roleOptions.value = response.data
    }
  } catch (error) {
    console.error('获取角色选项失败:', error)
  }
}

const handleFilter = () => {
  listQuery.page = 1
  getUserList()
}

const resetFilter = () => {
  Object.assign(listQuery, {
    page: 1,
    limit: 10,
    phone: '',
    nickname: '',
    status: ''
  })
  getUserList()
}

const handleCreate = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(userForm, {
    id: row.id,
    phone: row.phone,
    nickname: row.nickname,
    email: row.email,
    status: row.status,
    roleIds: row.roles || []
  })
  dialogVisible.value = true
}

const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}用户 ${row.nickname} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const newStatus = row.status === 1 ? 0 : 1
    await request.put(`/users/${row.id}/status`, { status: newStatus })

    ElMessage.success('操作成功')
    getUserList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('修改用户状态失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${row.nickname} 吗？此操作不可恢复。`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )

    await request.delete(`/users/${row.id}`)

    ElMessage.success('删除成功')
    getUserList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除用户失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  if (userFormRef.value) {
    userFormRef.value.resetFields()
  }
  Object.assign(userForm, {
    id: null,
    phone: '',
    nickname: '',
    email: '',
    password: '',
    status: 1,
    roleIds: []
  })
}

const submitForm = async () => {
  if (!userFormRef.value) return

  await userFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        await request.put(`/users/${userForm.id}`, userForm)
        ElMessage.success('更新成功')
      } else {
        await request.post('/users', userForm)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      getUserList()
    } catch (error) {
      console.error('保存用户失败:', error)
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.admin-user-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
<template>
  <div class="admin-role-list">
    <div class="header">
      <h2>角色管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增角色
      </el-button>
    </div>

    <el-card>
      <div class="filter-container">
        <el-input
          v-model="listQuery.name"
          placeholder="角色名称"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleFilter"
        />
        <el-input
          v-model="listQuery.code"
          placeholder="角色编码"
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
        :data="roleList"
        v-loading="loading"
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="120" />
        <el-table-column prop="code" label="角色编码" width="120" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handlePermission(row)"
            >
              权限
            </el-button>
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
          @size-change="getRoleList"
          @current-change="getRoleList"
        />
      </div>
    </el-card>

    <!-- 角色编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="roleForm.name"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="roleForm.code"
            placeholder="请输入角色编码"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog
      title="权限分配"
      v-model="permissionDialogVisible"
      width="600px"
    >
      <el-tree
        ref="permissionTreeRef"
        :data="permissionTreeData"
        show-checkbox
        node-key="id"
        :props="{ label: 'name', children: 'children' }"
        :default-checked-keys="checkedPermissionKeys"
      />
      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions" :loading="submitting">
          保存
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
const roleList = ref([])
const total = ref(0)
const permissionTreeData = ref([])
const checkedPermissionKeys = ref([])

const listQuery = reactive({
  page: 1,
  limit: 10,
  name: '',
  code: '',
  status: ''
})

const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const roleFormRef = ref()
const permissionTreeRef = ref()
const currentRoleId = ref(null)

const roleForm = reactive({
  id: null,
  name: '',
  code: '',
  status: 1,
  description: ''
})

const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在2-20个字符之间', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '角色编码格式不正确', trigger: 'blur' }
  ]
}

const dialogTitle = computed(() => {
  return isEdit.value ? '编辑角色' : '新增角色'
})

onMounted(() => {
  getRoleList()
})

const getRoleList = async () => {
  loading.value = true
  try {
    const response = await request.get('/roles', { params: listQuery })
    if (response.code === '200') {
      roleList.value = response.data
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const handleFilter = () => {
  listQuery.page = 1
  getRoleList()
}

const resetFilter = () => {
  Object.assign(listQuery, {
    page: 1,
    limit: 10,
    name: '',
    code: '',
    status: ''
  })
  getRoleList()
}

const handleCreate = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(roleForm, {
    id: row.id,
    name: row.name,
    code: row.code,
    status: row.status,
    description: row.description
  })
  dialogVisible.value = true
}

const handlePermission = async (row) => {
  currentRoleId.value = row.id

  try {
    // 获取权限树
    const permissionResponse = await request.get('/permissions/tree')
    if (permissionResponse.code === '200') {
      permissionTreeData.value = permissionResponse.data
    }

    // 获取角色已有权限
    const rolePermissionResponse = await request.get(`/roles/${row.id}/permissions`)
    if (rolePermissionResponse.code === '200') {
      checkedPermissionKeys.value = rolePermissionResponse.data
    }

    permissionDialogVisible.value = true
  } catch (error) {
    console.error('获取权限数据失败:', error)
    ElMessage.error('获取权限数据失败')
  }
}

const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}角色 ${row.name} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const newStatus = row.status === 1 ? 0 : 1
    await request.put(`/roles/${row.id}/status`, { status: newStatus })

    ElMessage.success('操作成功')
    getRoleList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('修改角色状态失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 ${row.name} 吗？此操作不可恢复。`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }
    )

    await request.delete(`/roles/${row.id}`)

    ElMessage.success('删除成功')
    getRoleList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除角色失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  if (roleFormRef.value) {
    roleFormRef.value.resetFields()
  }
  Object.assign(roleForm, {
    id: null,
    name: '',
    code: '',
    status: 1,
    description: ''
  })
}

const submitForm = async () => {
  if (!roleFormRef.value) return

  await roleFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        await request.put(`/roles/${roleForm.id}`, roleForm)
        ElMessage.success('更新成功')
      } else {
        await request.post('/roles', roleForm)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      getRoleList()
    } catch (error) {
      console.error('保存角色失败:', error)
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}

const savePermissions = async () => {
  if (!permissionTreeRef.value) return

  const checkedKeys = permissionTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys()
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

  submitting.value = true
  try {
    await request.post(`/roles/${currentRoleId.value}/permissions`, {
      permissionIds: allCheckedKeys
    })

    ElMessage.success('权限分配成功')
    permissionDialogVisible.value = false
  } catch (error) {
    console.error('分配权限失败:', error)
    ElMessage.error('分配权限失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.admin-role-list {
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
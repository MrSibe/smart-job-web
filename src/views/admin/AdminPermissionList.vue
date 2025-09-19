<template>
  <div class="admin-permission-list">
    <div class="header">
      <h2>权限管理</h2>
      <el-button type="primary" @click="handleCreate">
        <el-icon><Plus /></el-icon>
        新增权限
      </el-button>
    </div>

    <el-card>
      <div class="filter-container">
        <el-input
          v-model="listQuery.name"
          placeholder="权限名称"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleFilter"
        />
        <el-input
          v-model="listQuery.code"
          placeholder="权限编码"
          style="width: 200px; margin-right: 10px"
          @keyup.enter="handleFilter"
        />
        <el-select
          v-model="listQuery.type"
          placeholder="类型"
          style="width: 120px; margin-right: 10px"
          clearable
        >
          <el-option label="菜单" value="MENU" />
          <el-option label="按钮" value="BUTTON" />
          <el-option label="接口" value="API" />
        </el-select>
        <el-select
          v-model="listQuery.status"
          placeholder="状态"
          style="width: 120px; margin-right: 10px"
          clearable
        >
          <el-option label="启用" value="1" />
          <el-option label="禁用" value="0" />
        </el-select>
        <el-button type="primary" @click="handleFilter"> 搜索 </el-button>
        <el-button @click="resetFilter"> 重置 </el-button>
      </div>

      <el-table
        :data="permissionList"
        v-loading="loading"
        style="width: 100%; margin-top: 20px"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="name" label="权限名称" width="200" />
        <el-table-column prop="code" label="权限编码" width="150" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeTagType(row.type)">
              {{ getTypeText(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="path" label="路径" width="150" />
        <el-table-column prop="icon" label="图标" width="80" />
        <el-table-column prop="sort" label="排序" width="60" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
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
            <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
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
          @size-change="getPermissionList"
          @current-change="getPermissionList"
        />
      </div>
    </el-card>

    <!-- 权限编辑对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @close="resetForm">
      <el-form
        ref="permissionFormRef"
        :model="permissionForm"
        :rules="permissionRules"
        label-width="80px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="permissionForm.code" placeholder="请输入权限编码" />
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-select v-model="permissionForm.type" placeholder="请选择权限类型" style="width: 100%">
            <el-option label="菜单" value="MENU" />
            <el-option label="按钮" value="BUTTON" />
            <el-option label="接口" value="API" />
          </el-select>
        </el-form-item>
        <el-form-item label="父级权限" prop="parentId">
          <el-tree-select
            v-model="permissionForm.parentId"
            :data="permissionTreeOptions"
            :props="{ label: 'name', children: 'children', value: 'id' }"
            placeholder="请选择父级权限"
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="permissionForm.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="permissionForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="permissionForm.sort"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="permissionForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="permissionForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入权限描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting"> 确定 </el-button>
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
const permissionList = ref([])
const total = ref(0)
const permissionTreeOptions = ref([])

const listQuery = reactive({
  page: 1,
  limit: 10,
  name: '',
  code: '',
  type: '',
  status: ''
})

const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const permissionFormRef = ref()

const permissionForm = reactive({
  id: null,
  name: '',
  code: '',
  type: 'MENU',
  parentId: 0,
  path: '',
  icon: '',
  sort: 0,
  status: 1,
  description: ''
})

const permissionRules = {
  name: [
    { required: true, message: '请输入权限名称', trigger: 'blur' },
    { min: 2, max: 20, message: '权限名称长度在2-20个字符之间', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入权限编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_:]*$/, message: '权限编码格式不正确', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择权限类型', trigger: 'change' }]
}

const dialogTitle = computed(() => {
  return isEdit.value ? '编辑权限' : '新增权限'
})

const getTypeText = (type) => {
  const typeMap = {
    MENU: '菜单',
    BUTTON: '按钮',
    API: '接口'
  }
  return typeMap[type] || type
}

const getTypeTagType = (type) => {
  const typeTagMap = {
    MENU: 'primary',
    BUTTON: 'success',
    API: 'warning'
  }
  return typeTagMap[type] || 'info'
}

onMounted(() => {
  getPermissionList()
  getPermissionTreeOptions()
})

const getPermissionList = async () => {
  loading.value = true
  try {
    const response = await request.get('/permissions', { params: listQuery })
    if (response.code === '200') {
      permissionList.value = response.data
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
    ElMessage.error('获取权限列表失败')
  } finally {
    loading.value = false
  }
}

const getPermissionTreeOptions = async () => {
  try {
    const response = await request.get('/permissions/tree')
    if (response.code === '200') {
      permissionTreeOptions.value = response.data
    }
  } catch (error) {
    console.error('获取权限树失败:', error)
  }
}

const handleFilter = () => {
  listQuery.page = 1
  getPermissionList()
}

const resetFilter = () => {
  Object.assign(listQuery, {
    page: 1,
    limit: 10,
    name: '',
    code: '',
    type: '',
    status: ''
  })
  getPermissionList()
}

const handleCreate = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(permissionForm, {
    id: row.id,
    name: row.name,
    code: row.code,
    type: row.type,
    parentId: row.parentId,
    path: row.path,
    icon: row.icon,
    sort: row.sort,
    status: row.status,
    description: row.description
  })
  dialogVisible.value = true
}

const handleStatusChange = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要${row.status === 1 ? '禁用' : '启用'}权限 ${row.name} 吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const newStatus = row.status === 1 ? 0 : 1
    await request.put(`/permissions/${row.id}/status`, { status: newStatus })

    ElMessage.success('操作成功')
    getPermissionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('修改权限状态失败:', error)
      ElMessage.error('操作失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除权限 ${row.name} 吗？此操作不可恢复。`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })

    await request.delete(`/permissions/${row.id}`)

    ElMessage.success('删除成功')
    getPermissionList()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除权限失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

const resetForm = () => {
  if (permissionFormRef.value) {
    permissionFormRef.value.resetFields()
  }
  Object.assign(permissionForm, {
    id: null,
    name: '',
    code: '',
    type: 'MENU',
    parentId: 0,
    path: '',
    icon: '',
    sort: 0,
    status: 1,
    description: ''
  })
}

const submitForm = async () => {
  if (!permissionFormRef.value) return

  await permissionFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (isEdit.value) {
        await request.put(`/permissions/${permissionForm.id}`, permissionForm)
        ElMessage.success('更新成功')
      } else {
        await request.post('/permissions', permissionForm)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      getPermissionList()
      getPermissionTreeOptions()
    } catch (error) {
      console.error('保存权限失败:', error)
      ElMessage.error('保存失败')
    } finally {
      submitting.value = false
    }
  })
}
</script>

<style scoped>
.admin-permission-list {
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

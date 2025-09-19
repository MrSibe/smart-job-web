<template>
  <div class="job-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>岗位管理</span>
          <div>
            <el-button type="primary" @click="handleAdd">新增岗位</el-button>
            <el-button type="success" @click="showBatchDialog = true">JSON批量新增</el-button>
          </div>
        </div>
      </template>

      <!-- 搜索条件 -->
      <el-form :model="searchForm" label-width="80px" class="search-form">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="岗位名称">
              <el-input v-model="searchForm.name" placeholder="请输入岗位名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司名称">
              <el-input v-model="searchForm.companyName" placeholder="请输入公司名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工作地点">
              <el-input v-model="searchForm.location" placeholder="请输入工作地点" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 岗位列表 -->
      <el-table :data="jobList" v-loading="loading" style="width: 100%" border>
        <el-table-column prop="id" label="岗位编号" width="180" />
        <el-table-column prop="name" label="岗位名称" width="180" />
        <el-table-column prop="companyName" label="公司名称" width="180" />
        <el-table-column prop="location" label="工作地点" width="120" />
        <el-table-column prop="salary" label="薪资范围" width="120" />
        <el-table-column prop="jobType" label="岗位类型" width="120" />
        <el-table-column prop="isActive" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'danger'">
              {{ scope.row.isActive ? '有效' : '无效' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </el-card>

    <!-- 岗位编辑对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form :model="jobForm" :rules="jobFormRules" ref="jobFormRef" label-width="100px">
        <el-form-item label="岗位名称" prop="name">
          <el-input v-model="jobForm.name" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company_name">
          <el-input v-model="jobForm.company_name" />
        </el-form-item>
        <el-form-item label="工作地点" prop="location">
          <el-input v-model="jobForm.location" />
        </el-form-item>
        <el-form-item label="薪资范围" prop="salary">
          <el-input v-model="jobForm.salary" />
        </el-form-item>
        <el-form-item label="岗位类型" prop="job_type">
          <el-input
            v-model="jobForm.job_type"
            placeholder="请输入岗位类型，如：全职、兼职、实习、远程等"
          />
        </el-form-item>
        <el-form-item label="学历要求" prop="education_required">
          <el-input
            v-model="jobForm.education_required"
            placeholder="请输入学历要求，如：不限、大专、本科、硕士、博士等"
          />
        </el-form-item>
        <el-form-item label="岗位标签" prop="tags">
          <el-input v-model="jobForm.tags" placeholder="请输入岗位标签，如：Java,Spring,后端" />
        </el-form-item>
        <el-form-item label="岗位链接" prop="url">
          <el-input v-model="jobForm.url" />
        </el-form-item>
        <el-form-item label="有效期至" prop="expiration_date">
          <el-date-picker
            v-model="jobForm.expiration_date"
            type="date"
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch
            v-model="jobForm.is_active"
            :active-value="1"
            :inactive-value="0"
            active-text="有效"
            inactive-text="无效"
          />
        </el-form-item>
        <el-form-item label="岗位描述" prop="description">
          <el-input v-model="jobForm.description" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- JSON批量新增对话框 -->
    <el-dialog title="JSON批量新增岗位" v-model="showBatchDialog" width="800px">
      <el-alert
        title="请粘贴JSON格式的岗位数据，支持单个对象或对象数组"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      />
      <el-input
        v-model="batchJsonData"
        type="textarea"
        :rows="15"
        placeholder="请输入JSON格式的岗位数据，例如：[{&#x27;name&#x27;: &#x27;Java开发工程师&#x27;, &#x27;description&#x27;: &#x27;负责Java后端开发工作&#x27;, ...}]"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBatchDialog = false">取消</el-button>
          <el-button type="primary" @click="handleBatchAdd" :loading="batchLoading"
            >批量新增</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

// 搜索表单
const searchForm = reactive({
  name: '',
  companyName: '',
  location: ''
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 岗位列表
const jobList = ref([])
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const saveLoading = ref(false)

// JSON批量新增相关
const showBatchDialog = ref(false)
const batchJsonData = ref('')
const batchLoading = ref(false)

// 岗位表单
const jobFormRef = ref()
const jobForm = reactive({
  id: '',
  name: '',
  company_name: '',
  location: '',
  salary: '',
  job_type: '',
  education_required: '',
  description: '',
  url: '',
  expiration_date: '',
  is_active: 1,
  tags: ''
})

// 表单验证规则
const jobFormRules = {
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }],
  company_name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入工作地点', trigger: 'blur' }],
  url: [{ required: true, message: '请输入岗位链接', trigger: 'blur' }]
}

// 获取岗位列表
const fetchJobList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      size: pagination.pageSize,
      name: searchForm.name,
      companyName: searchForm.companyName,
      location: searchForm.location
    }

    // 使用正确的API路径
    const response = await request.get('/jobs', { params })
    if (response.code === '200') {
      jobList.value = response.data.records || response.data.data
      pagination.total = response.data.total
    } else {
      ElMessage.error(response.msg || '获取岗位列表失败')
    }
  } catch (error) {
    console.error('获取岗位列表失败:', error)
    ElMessage.error('获取岗位列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = () => {
  pagination.currentPage = 1
  fetchJobList()
}

// 处理重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.companyName = ''
  searchForm.location = ''
  pagination.currentPage = 1
  fetchJobList()
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  fetchJobList()
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  fetchJobList()
}

// 处理新增
const handleAdd = () => {
  dialogTitle.value = '新增岗位'
  isEdit.value = false
  // 重置表单
  Object.keys(jobForm).forEach((key) => {
    jobForm[key] = ''
  })
  jobForm.is_active = 1
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑岗位'
  isEdit.value = true
  // 填充表单数据
  Object.keys(jobForm).forEach((key) => {
    // 特别处理is_active字段，将Boolean值转换为数字
    if (key === 'is_active') {
      jobForm[key] = row.isActive ? 1 : 0
    } else if (key === 'company_name') {
      jobForm[key] = row.companyName || ''
    } else if (key === 'education_required') {
      jobForm[key] = row.educationRequired || ''
    } else if (key === 'expiration_date') {
      jobForm[key] = row.expirationDate || ''
    } else if (key === 'job_type') {
      jobForm[key] = row.jobType || ''
    } else if (key === 'tags') {
      jobForm[key] = row.tags || ''
    } else {
      jobForm[key] = row[key] || ''
    }
  })
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除岗位 "${row.name}" 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      try {
        // 修正API路径，移除/admin前缀
        const response = await request.delete(`/jobs/${row.id}`)
        if (response.code === '200') {
          ElMessage.success('删除成功')
          fetchJobList()
        } else {
          ElMessage.error(response.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      // 用户取消删除
    })
}

// 处理保存
const handleSave = async () => {
  try {
    await jobFormRef.value.validate()

    saveLoading.value = true

    const formData = { ...jobForm }

    formData.is_active = formData.is_active == 1

    if (isEdit.value) {
      // 编辑岗位
      // 修正API路径，移除/admin前缀
      const response = await request.put(`/jobs/${jobForm.id}`, formData)
      if (response.code === '200') {
        ElMessage.success('更新成功')
        dialogVisible.value = false
        fetchJobList()
      } else {
        ElMessage.error(response.msg || '更新失败')
      }
    } else {
      // 新增岗位
      // 修正API路径，移除/admin前缀
      const response = await request.post('/jobs/', formData)
      if (response.code === '200') {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        fetchJobList()
      } else {
        ElMessage.error(response.msg || '新增失败')
      }
    }
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    saveLoading.value = false
  }
}

// 处理对话框关闭
const handleDialogClose = () => {
  jobFormRef.value.resetFields()
}

// 处理JSON批量新增
const handleBatchAdd = async () => {
  if (!batchJsonData.value.trim()) {
    ElMessage.warning('请输入JSON数据')
    return
  }

  try {
    batchLoading.value = true

    // 解析JSON数据
    let jobsData
    try {
      jobsData = JSON.parse(batchJsonData.value)
    } catch (error) {
      ElMessage.error('JSON格式错误，请检查输入')
      return
    }

    // 统一处理为数组格式
    const jobs = Array.isArray(jobsData) ? jobsData : [jobsData]

    if (jobs.length === 0) {
      ElMessage.warning('未找到有效的岗位数据')
      return
    }

    // 发送批量创建请求
    const response = await request.post('/jobs/batch', jobs)

    if (response.code === '200') {
      ElMessage.success(`成功批量新增 ${jobs.length} 个岗位`)
      showBatchDialog.value = false
      batchJsonData.value = ''
      fetchJobList()
    } else {
      ElMessage.error(response.msg || '批量新增失败')
    }
  } catch (error) {
    console.error('批量新增失败:', error)
    ElMessage.error('批量新增失败')
  } finally {
    batchLoading.value = false
  }
}

onMounted(() => {
  fetchJobList()
})
</script>

<style scoped>
.job-management {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: right;
}
</style>

<template>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :pager-count="5"
      layout="total, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      background
    />

    <div class="page-info">
      第 {{ currentPage }} 页，共 {{ totalPages }} 页（共 {{ total }} 条记录）
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  total: {
    type: Number,
    required: true,
    default: 0
  }
})

const emit = defineEmits(['page-changed'])

const currentPage = ref(props.currentPage)
const pageSize = ref(5)

// 监听props变化并更新内部状态
watch(
  () => props.currentPage,
  (newVal) => {
    currentPage.value = newVal
  }
)

// 处理当前页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  emit('page-changed', val)
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin: 30px 0;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .pagination-container {
    gap: 10px;
  }

  .page-info {
    font-size: 0.8rem;
  }
}
</style>

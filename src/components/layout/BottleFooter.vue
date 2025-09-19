<template>
  <footer class="BottleFooter">
    <div class="footer-content">
      <p class="copyright-text">@版权所有：四川农业大学信息工程学院</p>
    </div>
  </footer>
</template>

<script setup>
// 这里如果没有复杂逻辑，简单的样式展示组件不需要额外的逻辑代码
</script>

<style scoped>
.BottleFooter {
  background-color: #f9f9f9;
  border-top: 3px solid #e74c3c; /* 红色上边框，你可以根据实际调整颜色和宽度 */
  padding: 20px;
  text-align: center;
  height: 100px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 轻微阴影效果 */
  display: flex;
  align-items: center;
  justify-content: center; /* 如果水平方向也需要居中，可以添加这行代码 */
}

.copyright-text {
  color: #95a5a6; /* 浅灰色文字颜色，可调整 */
  margin: 0;
  font-size: 14px;
}
</style>
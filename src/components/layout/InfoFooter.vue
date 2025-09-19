<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="link-section">
        <h3>友情链接</h3>
        <ul>
          <li><a href="https://www.sicau.edu.cn/">四川农业大学</a></li>
          <li><a href="http://xxgc.sicau.edu.cn">信息工程学院</a></li>
          <li><a href="https://zs.sicau.edu.cn/">四川农业大学招生网</a></li>
          <li><a href="https://tw.sicau.edu.cn/">共青团四川农业大学委员会</a></li>
        </ul>
      </div>
      <div class="contact-section">
        <h3>联系方式</h3>
        <p>官网：<a href="http://xxgc.sicau.edu.cn">http://xxgc.sicau.edu.cn</a></p>
        <p>微信: @四川农业大学信息工程学院</p>
        <p>微博: @四川农业大学信息工程学院</p>
        <p>地址: 四川省雅安市雨城区新康路46号四川农业大学第四教学楼</p>
        <p>邮编: 625014 电话: 0835 - 2882177</p>
      </div>
      <div class="follow-section">
        <h3>关注我们</h3>
        <div class="qr-codes-wrapper">
          <div class="qr-code-container">
            <span>微信公众</span>
            <img src="@/assets/wechat_qr.png" alt="微信二维码">
          </div>
          <div class="qr-code-container">
            <span>新浪微博</span>
            <img src="@/assets/weibo_qr.png" alt="微博二维码">
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'InfoFooter'
}
</script>

<style scoped>
/* 整体footer样式 */
.footer {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #ddd; /* 顶部添加浅灰色分割线 */
}

.footer-content {
  display: flex;
  justify-content: space-around;
  margin-bottom: 5px;
}

/* 友情链接部分样式 */
.link-section {
  width: 30%;
}
.link-section h3 {
  color: #999;
  margin-bottom: 10px;
}
.link-section ul {
  list-style-type: none;
  padding: 0;
}
.link-section ul li {
  margin-bottom: 5px;
}
.link-section ul li a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease; /* 链接颜色过渡效果 */
}
.link-section ul li a:hover {
  color: #e74c3c; /* 鼠标悬停时链接变色 */
}

/* 联系方式部分样式 */
.contact-section {
  width: 30%;
}
.contact-section h3 {
  color: #999;
  margin-bottom: 10px;
}
.contact-section p {
  color: #666;
  margin-bottom: 5px;
}
.contact-section p a {
  color: #e74c3c;
  text-align: left; /* 让联系方式的文本左对齐 */
  text-decoration: none;
}

/* 关注我们部分样式 */
.follow-section {
  width: 30%;
  text-align: center;
}

.follow-section h3 {
  color: #999;
  margin-bottom: 10px;
}

.qr-codes-wrapper {
  display: flex;
  justify-content: space-around;
}

.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
}

.qr-code-container span {
  font-size: 12px;
  margin-bottom: 5px;
}

.qr-code-container img {
  width: 80px;
  height: 80px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
  }
  
  .link-section,
  .contact-section,
  .follow-section {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
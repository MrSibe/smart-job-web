<template>
  <div class="about-page">
    <!-- 导航栏 -->
    <NavBar />

    <div class="container">
      <!-- 内容区域 -->
      <main class="about-content">
        <el-card class="mb-8" shadow="hover">
          <!-- 平台简介 -->
          <div class="all-introduce prose prose-lg max-w-none mb-12 text-gray-700">
            <h2 class="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-primary mb-6 text-center">
              关于我们
            </h2>
            <p class="text-center text-lg font-medium text-gray-800 mb-6">
              信息工程学院就业平台 —— 连接人才与未来的桥梁
            </p>
            <p class="text-center mb-4">
              我们致力于为学院学生和企业搭建沟通桥梁，提供优质的就业服务
            </p>
            <p class="text-center mb-4">汇聚众多优质企业热招岗位，助力学生开启职业发展新篇章</p>
            <p class="text-center">专业教师与技术团队保驾护航，打造便捷高效的就业服务平台</p>
          </div>

          <!-- 学院简介 -->
          <div class="xxcc-introduce space-y-8">
            <h2 class="text-2xl font-bold text-primary mb-6 border-b pb-3 text-center">学院简介</h2>

            <el-alert :closable="false" type="info" class="mb-6">
              <p class="text-gray-700 leading-relaxed text-center mb-4">
                信息工程学院位于雅安校区，其前身是1985年成立的校实验中心计算机室，
                1995年并入新成立的工程技术学院；2002年更名为信息与工程技术学院；
                2014年3月，学校组建信息工程学院。
              </p>
            </el-alert>

            <!-- 教学资源 -->
            <el-card class="teaching-resource-section mb-6" shadow="never">
              <template #header>
                <div class="flex items-center justify-center">
                  <i class="fa fa-graduation-cap mr-2 text-blue-600"></i>
                  <span class="font-semibold text-xl text-primary">教学资源</span>
                </div>
              </template>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <el-card shadow="hover">
                  <template #header>
                    <h4 class="font-medium text-blue-700 flex items-center">
                      <i class="fa fa-book mr-2"></i> 学科专业
                    </h4>
                  </template>
                  <ul class="space-y-2 text-gray-700">
                    <li>3个系：计算机科学系、数据科学系、物联网工程系</li>
                    <li>1个研究中心：数字农业工程技术研究中心</li>
                    <li>3个硕士专业：农业信息工程、电子信息、农业工程与信息技术</li>
                    <li>3个本科专业：计算机科学与技术、物联网工程、数据科学与大数据技术</li>
                  </ul>
                </el-card>
                <el-card shadow="hover">
                  <template #header>
                    <h4 class="font-medium text-blue-700 flex items-center">
                      <i class="fa fa-flask mr-2"></i> 实验平台
                    </h4>
                  </template>
                  <ul class="space-y-2 text-gray-700">
                    <li>1个省级学科平台：四川省高等学校重点实验室</li>
                    <li>1个地市级工程技术研究中心</li>
                    <li>3个校级实验室（含校级实验教学示范中心）</li>
                    <li>1个虚拟实验平台，2个校内实践实训基地</li>
                  </ul>
                </el-card>
              </div>
            </el-card>

            <!-- 科研成果 -->
            <el-card class="study-result-section mb-6" shadow="never">
              <template #header>
                <div class="flex items-center justify-center">
                  <i class="fa fa-flask mr-2 text-green-600"></i>
                  <span class="font-semibold text-xl text-primary">科研成果</span>
                </div>
              </template>
              <div>
                <p class="text-gray-700 leading-relaxed text-center mb-4">
                  教师主持、主研各类科研项目60余项；发表论文260余篇，其中SCI收录论文100余篇；出版教材、专著20余部，获授权专利80余项，软件著作权90余项。
                </p>
              </div>
            </el-card>

            <!-- 校企合作与国际交流 -->
            <el-card class="international-connection" shadow="never">
              <template #header>
                <div class="flex items-center justify-center">
                  <i class="fa fa-handshake mr-2 text-purple-600"></i>
                  <span class="font-semibold text-xl text-primary">校企合作与国际交流</span>
                </div>
              </template>
              <div class="space-y-6">
                <el-card shadow="hover">
                  <template #header>
                    <h4 class="font-medium text-purple-700 flex items-center">
                      <i class="fa fa-building mr-2"></i> 校企合作
                    </h4>
                  </template>
                  <p class="text-gray-700 leading-relaxed">
                    学院积极参与"校企双进"、川西大数据产业园、中国电信四川公司&四川农业大学智慧农业创新实验室等乡村振兴战略项目；
                    坚持"产、学、研、用"相结合，将创新创业纳入教育教学整体发展规划中，贯穿人才培养全过程；
                    与60余家企事业单位联合建立校外实践基地。
                  </p>
                </el-card>

                <el-card shadow="hover">
                  <template #header>
                    <h4 class="font-medium text-purple-700 flex items-center">
                      <i class="fa fa-globe mr-2"></i> 国际交流
                    </h4>
                  </template>
                  <p class="text-gray-700 leading-relaxed">
                    大量毕业生在阿里巴巴、微软、腾讯、字节跳动、工商银行、建设银行等高端互联网行业和金融行业入职；
                    学院近年推免研究生全部进入北京大学、国防科技大学等985或211高校深造；
                    通过远程继续教育培养信息技术类专业本、专科生5000余人；
                    学院与希腊帕特雷大学、英国切斯特大学、德国德累斯顿工业大学签订交流合作协议，积极推进国际化办学。
                  </p>
                </el-card>
              </div>
            </el-card>
          </div>
        </el-card>
      </main>
    </div>

    <!-- 页脚 -->
    <div class="footer-container">
      <InfoFooter />
      <BottleFooter />
    </div>
  </div>
</template>

<script>
import { ElCard, ElAlert } from 'element-plus'
import NavBar from '@/components/layout/NavBar.vue'
import InfoFooter from '@/components/layout/InfoFooter.vue'
import BottleFooter from '@/components/layout/BottleFooter.vue'

export default {
  name: 'AboutPage',
  components: {
    ElCard,
    ElAlert,
    BottleFooter,
    NavBar,
    InfoFooter
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  margin: 40px 5%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.container {
  flex: 1;
  width: 100%;
  padding: 0 30px;
}

.about-content {
  flex: 1;
  padding: 30px 0;
  width: 100%;
}

.footer-container {
  margin-top: auto;
}

/* Element Plus组件样式优化 */
:deep(.el-card) {
  border-radius: 12px;
  border: 1px solid #ebeef5;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-alert) {
  border-radius: 12px;
}

@media (max-width: 768px) {
  .about-page {
    margin: 20px 5%;
  }

  .container {
    padding: 0 15px;
  }

  .about-content {
    padding: 20px 0;
  }

  :deep(.grid) {
    grid-template-columns: 1fr;
  }
}
</style>

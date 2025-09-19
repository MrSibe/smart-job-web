<template>
  <article class="job-card">
    <div class="card-header">
      <div class="header-left">
        <h3 class="job-title">{{ job.title }}</h3>
        <p class="company">{{ job.company }}</p>
      </div>
      <span class="salary">{{ job.salary }}</span>
    </div>

    <div class="card-body">
      <div class="meta-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>{{ job.location }}</span>
      </div>
      <div class="meta-item">
        <i class="fas fa-user-tie"></i>
        <span>{{ job.job_type }}</span>
      </div>
    </div>

    <div class="card-footer">
      <p class="description">{{ job.description }}</p>
      <router-link 
        :to="`/jobs/${job.id}`"
        class="detail-btn"
      >
        查看详情 <i class="fas fa-arrow-right"></i>
      </router-link>
    </div>
  </article>
</template>

<script>
export default {
  name: 'JobCard',
  props: {
    job: {
      type: Object,
      required: true,
      validator: (value) => {
        return [
          'id', 
          'title', 
          'company', 
          'location', 
          'job_type', 
          'salary', 
          'description'
        ].every(key => key in value)
      }
    }
  }
}
</script>

<style scoped>
.job-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.job-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left {
  flex: 1;
}

.job-title {
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0 0 8px 0;
}

.company {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin: 0;
}

.salary {
  background: #e8f5e9;
  color: #42b983;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.card-body {
  display: flex;
  gap: 20px;
  margin: 16px 0;
  padding: 16px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
}

.meta-item i {
  color: #42b983;
}

.card-footer {
  margin-top: 16px;
}

.description {
  color: #444;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #42b983;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.detail-btn:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .card-body {
    flex-direction: column;
    gap: 12px;
  }
  
  .job-card {
    padding: 20px;
  }
}
</style>
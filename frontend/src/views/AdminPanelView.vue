<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AdminPanelHeader from '@/components/adminPanel/AdminPanelHeader.vue';
import AdminPanelGrid from '@/components/adminPanel/AdminPanelGrid.vue';

const router = useRouter();

const adminPanels = ref([
  {
    id: 1,
    title: 'User Management',
    icon: 'users',
    content: 'Total users: 1,250',
    color: 'bg-blue-500',
    size: 'md',
    route: '/admin/users',
    description: 'Manage user accounts, permissions, and activity tracking'
  },
  {
    id: 2,
    title: 'Content Statistics',
    icon: 'chart-bar',
    content: '78 articles published this month',
    color: 'bg-green-500',
    size: 'md',
    route: '/admin/statistics',
    description: 'View analytics, content performance, and audience metrics'
  },
  {
    id: 3,
    title: 'System Health',
    icon: 'server',
    content: 'All systems operational',
    color: 'bg-purple-500',
    size: 'sm',
    route: '/admin/system',
    description: 'Monitor application performance and server status'
  },
  {
    id: 4,
    title: 'Recent Activity',
    icon: 'clock',
    content: '15 user actions in the last hour',
    color: 'bg-yellow-500',
    size: 'sm',
    route: '/admin/activity',
    description: 'Track recent changes and user interactions'
  },
  {
    id: 5,
    title: 'Pending Approvals',
    icon: 'check-circle',
    content: '7 items awaiting approval',
    color: 'bg-red-500',
    size: 'lg',
    route: '/admin/approvals',
    description: 'Review and process items waiting for administrative approval'
  }
]);
</script>

<template>
  <main class="flex-1 container mx-auto px-4 py-6">
    <AdminPanelHeader title = "Pannello di Controllo Admin" />
    <AdminPanelGrid :panels = "adminPanels" />
  </main>
</template>
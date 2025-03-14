import { RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import UploadInfoPage from '@/pages/UploadInfoPage';
import ContactPage from '@/pages/ContactPage';
import FeedbackPage from '@/pages/FeedbackPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UploadExamPage from '@/pages/UploadExamPage';
import SearchLayout from '@/layouts/SearchLayout';
import SearchPage from '@/pages/SearchPage';
import TentaPage from '@/pages/TentaPage';
import LoginPage from './pages/auth/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/auth/Dashboard';
import RemoveExamsPage from './pages/auth/RemoveExamsPage';
import UploadedExamsPage from './pages/auth/UploadedExamsPage';
import AddExamsPage from './pages/auth/AddExamsPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/upload-info',
        element: <UploadInfoPage />,
      },
      {
        path: '/kontakt',
        element: <ContactPage />,
      },
      {
        path: '/feedback',
        element: <FeedbackPage />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        path: '/upload-exams',
        element: <UploadExamPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: '/admin/login',
        element: <LoginPage />,
      },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          {
            path: '/admin/dashboard',
            element: <Dashboard />,
          },
          {
            path: '/admin/dashboard/add-exams',
            element: <AddExamsPage />,
          },
          {
            path: '/admin/dashboard/review',
            element: <UploadedExamsPage />,
          },
          {
            path: '/admin/dashboard/remove-exams',
            element: <RemoveExamsPage />,
          },
        ],
      },
      {
        path: '/search',
        element: <SearchLayout />,
        children: [
          {
            path: '/search/:courseCode',
            element: <SearchPage />,
          },
          {
            path: '/search/:courseCode/:tenta_id',
            element: <TentaPage />,
          },
        ],
      },
    ],
  },
];

export default routes;

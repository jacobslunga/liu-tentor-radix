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
import OmOss from '@/pages/AboutUs';
// import LoginPage from './pages/auth/LoginPage';
// import AdminLayout from './layouts/AdminLayout';
// import RemoveExamsPage from './pages/auth/RemoveExamsPage';
// import UploadedExamsPage from './pages/auth/UploadedExamsPage';
// import AddExamsPage from './pages/auth/AddExamsPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'upload-info', element: <UploadInfoPage /> },
      { path: 'kontakt', element: <ContactPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'privacy-policy', element: <PrivacyPolicyPage /> },
      { path: 'upload-exams', element: <UploadExamPage /> },
      // { path: 'partners', element: <Partners /> },
      { path: 'om-oss', element: <OmOss /> },
      { path: '*', element: <NotFoundPage /> },
      // {
      //   path: 'admin',
      //   element: <AdminLayout />,
      //   children: [
      //     { path: 'dashboard/add-exams', element: <AddExamsPage /> },
      //     { path: 'dashboard/review', element: <UploadedExamsPage /> },
      //     { path: 'dashboard/remove-exams', element: <RemoveExamsPage /> },
      //   ],
      // },
      // {
      //   path: '/admin/login',
      //   element: <LoginPage />,
      // },
      {
        path: 'search',
        element: <SearchLayout />,
        children: [
          { path: ':courseCode', element: <SearchPage /> },
          { path: ':courseCode/:tenta_id', element: <TentaPage /> },
        ],
      },
    ],
  },
];

export default routes;

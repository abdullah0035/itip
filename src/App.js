import { ToastContainer } from 'react-toastify'
import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import { Provider } from 'react-redux' // Add this import
import './App.css'
import './components/assets/css/color.css'
import './components/assets/css/style.css'
import './components/assets/css/fonts.css'
import Routing from './components/routes/routes'
import Header from './components/pages/dashboard/dashboardComponent/header'
import Sidebar from './components/pages/dashboard/dashboardComponent/sidebar'
import { useLayout } from './utils/hooks/useLayout'
import { sidebarItems } from './utils/config/layoutConfig'
import { store } from './components/redux/store'

// Loading component
const LoadingSpinner = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
  </div>
)

// Main layout wrapper component
const LayoutWrapper = () => {
  const {
    showLayout,
    sidebarOpen,
    user,
    currentPath,
    isAuthRoute,
    toggleSidebar,
    closeSidebar,
    logout
  } = useLayout()

  return (
    <div className='min-h-screen'>
      {/* Conditional Header and Sidebar */}
      {showLayout && (
        <>
          <Header
            onToggleSidebar={toggleSidebar}
            user={user}
            onLogout={logout}
          />
          <Sidebar
            isOpen={sidebarOpen}
            onClose={closeSidebar}
            sidebarItems={sidebarItems}
            currentPath={currentPath}
          />
        </>
      )}

      {/* Main Content Area - Apply mainScreen class conditionally */}
      <div
        className={`${showLayout ? 'sm:ml-64' : ''} ${
          isAuthRoute ? 'mainScreen h_100vh' : ''
        }`}
      >
        <div className={showLayout ? 'pt-16' : ''}>
          <Routing />
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className={showLayout ? 'mt-16 sm:ml-64' : ''}
        toastClassName='text-sm'
      />
    </div>
  )
}

function App () {
  return (
    <Provider store={store}> {/* Wrap everything with Redux Provider */}
      <Suspense fallback={<LoadingSpinner />}>
        {/* Remove mainScreen class from here - it's now conditional */}
        <main className='h_100vh'>
          <BrowserRouter>
            <LayoutWrapper />
          </BrowserRouter>
        </main>
      </Suspense>
    </Provider>
  )
}

export default App
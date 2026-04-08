import { 
  createRouter, 
  createRoute, 
  createRootRoute, 
  RouterProvider, 
  Outlet, 
  Link,
  useNavigate
} from '@tanstack/react-router'
import { 
  AppShell, 
  AppShellSidebar, 
  AppShellMain, 
  MobileSidebarTrigger, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarItem, 
  Toaster,
  Button,
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@blinkdotnew/ui'
import { 
  LayoutDashboard, 
  BookOpen, 
  User, 
  LogOut, 
  ShieldCheck, 
  Code,
  MessageSquare
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { blink } from './lib/blink'

// Import components
import { DashboardPage } from './pages/Dashboard'
import { CoursesPage, CourseDetailPage } from './pages/Courses'
import { LessonPlayerPage } from './pages/LessonPlayer'
import { ProfilePage } from './pages/Profile'
import { ChatPage } from './pages/Chat'

// --- Auth Hook ---
function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.isLoading) setIsLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, isLoading, isAuthenticated: !!user }
}

// --- Layout Component ---
function DashboardLayout() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <ShieldCheck className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-2">SecureLearn Platform</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Accédez à des formations de pointe en cybersécurité et développement web.
        </p>
        <Button size="lg" onClick={() => blink.auth.login()}>
          Se connecter / S'inscrire
        </Button>
      </div>
    )
  }

  return (
    <AppShell>
      <AppShellSidebar>
        <Sidebar>
          <SidebarHeader className="flex items-center gap-2 px-4 py-6 border-b border-border/50">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg tracking-tight">SecureLearn</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                label="Tableau de bord" 
                href="/" 
              />
              <SidebarItem 
                icon={<BookOpen size={20} />} 
                label="Mes Formations" 
                href="/courses" 
              />
              <SidebarItem 
                icon={<MessageSquare size={20} />} 
                label="Support Chat" 
                href="/chat" 
              />
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Programmes</SidebarGroupLabel>
              <SidebarItem 
                icon={<ShieldCheck size={20} className="text-blue-400" />} 
                label="Cybersécurité" 
                href="/courses?category=Cybersecurity" 
              />
              <SidebarItem 
                icon={<Code size={20} className="text-emerald-400" />} 
                label="Dév. Web" 
                href="/courses?category=Web%20Development" 
              />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 px-2 hover:bg-accent/50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {user?.email?.[0].toUpperCase() || <User size={16} />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {user?.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile">Mon Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => blink.auth.logout()} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
      </AppShellSidebar>
      <AppShellMain>
        <div className="md:hidden flex items-center gap-2 px-4 h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <MobileSidebarTrigger />
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm">SecureLearn</span>
        </div>
        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </AppShellMain>
    </AppShell>
  )
}

// --- Routes ---
const rootRoute = createRootRoute({ component: DashboardLayout })

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: DashboardPage })
const coursesRoute = createRoute({ getParentRoute: () => rootRoute, path: '/courses', component: CoursesPage })
const courseDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/courses/$id', component: CourseDetailPage })
const lessonRoute = createRoute({ getParentRoute: () => rootRoute, path: '/lessons/$id', component: LessonPlayerPage })
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: ProfilePage })
const chatRoute = createRoute({ getParentRoute: () => rootRoute, path: '/chat', component: ChatPage })

const routeTree = rootRoute.addChildren([
  indexRoute, 
  coursesRoute, 
  courseDetailRoute, 
  lessonRoute, 
  profileRoute,
  chatRoute
])

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}

export default function App() {
  return <RouterProvider router={router} />
}

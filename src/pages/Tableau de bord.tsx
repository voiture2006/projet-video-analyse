import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody, 
  StatGroup, 
  Stat, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge,
  Skeleton
} from '@blinkdotnew/ui'
import { 
  ShieldCheck, 
  Code, 
  TrendingUp, 
  Clock, 
  PlayCircle, 
  Award 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { blink } from '../lib/blink'
import { Link } from '@tanstack/react-router'

export function DashboardPage() {
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => blink.db.courses.list({ limit: 3 })
  })

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: () => blink.db.userProgress.list({ limit: 5 })
  })

  return (
    <Page>
      <PageHeader>
        <PageTitle className="text-3xl font-extrabold tracking-tight">Bonjour, 👋</PageTitle>
        <PageDescription className="text-lg">
          Prêt à continuer votre évolution dans la cybersécurité et le développement ?
        </PageDescription>
      </PageHeader>
      
      <PageBody className="space-y-8">
        <StatGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat 
            label="Formations en cours" 
            value="2" 
            icon={<PlayCircle className="text-primary" />} 
          />
          <Stat 
            label="Cours terminés" 
            value="5" 
            icon={<Award className="text-emerald-400" />} 
          />
          <Stat 
            label="Temps d'apprentissage" 
            value="12h 45m" 
            icon={<Clock className="text-amber-400" />} 
          />
          <Stat 
            label="Niveau actuel" 
            value="Intermédiaire" 
            icon={<TrendingUp className="text-purple-400" />} 
          />
        </StatGroup>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <PlayCircle className="text-primary" />
                Continuer là où vous vous êtes arrêté
              </h2>
              <Button variant="link" asChild>
                <Link to="/courses">Voir tout</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coursesLoading ? (
                Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
              ) : (
                courses?.map((course: any) => (
                  <Card key={course.id} className="group hover:shadow-lg transition-all border-border/50 bg-secondary/30">
                    <CardHeader className="p-0">
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl relative">
                        <img 
                          src={course.thumbnailUrl} 
                          alt={course.title} 
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                            {course.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2 line-clamp-1">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-primary">65% Terminé</div>
                        <Button size="sm" asChild>
                          <Link to="/courses/$id" params={{ id: course.id }}>Reprendre</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-primary" />
              Activité Récente
            </h2>
            <Card className="border-border/50 bg-secondary/30">
              <CardContent className="p-4 space-y-4">
                {progressLoading ? (
                  Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                ) : (
                  progress?.map((p: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="mt-1">
                        <ShieldCheck size={16} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Leçon terminée</p>
                        <p className="text-xs text-muted-foreground truncate w-40">
                          {p.lessonId}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">2h ago</span>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Aucune activité récente.
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  Button, 
  Badge, 
  Skeleton, 
  Input, 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@blinkdotnew/ui'
import { 
  Search, 
  BookOpen, 
  Filter, 
  ShieldCheck, 
  Code, 
  Layout, 
  Star, 
  Clock, 
  Layers 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { blink } from '../lib/blink'
import { Link, useSearch } from '@tanstack/react-router'
import { useState } from 'react'

export function CoursesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', category, search],
    queryFn: () => blink.db.courses.list({
      where: category !== 'all' ? { category } : undefined,
      limit: 20
    })
  })

  // Filter in memory for search
  const filteredCourses = courses?.filter((c: any) => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Page>
      <PageHeader className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <PageTitle className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="text-primary" />
              Catalogue de Formations
            </PageTitle>
            <PageDescription className="text-lg">
              Explorez nos programmes certifiants en cybersécurité et tech.
            </PageDescription>
          </div>
        </div>
      </PageHeader>

      <PageBody className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 bg-secondary/20 p-4 rounded-xl border border-border/50 sticky top-14 md:top-20 z-30 backdrop-blur">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher une formation..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-background border-border/50"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[200px] bg-background border-border/50">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              <SelectItem value="Cybersecurity">Cybersécurité</SelectItem>
              <SelectItem value="Web Development">Développement Web</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-xl" />)
          ) : filteredCourses?.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-semibold">Aucun cours trouvé</h3>
              <p className="text-muted-foreground">Essayez d'ajuster votre recherche ou vos filtres.</p>
            </div>
          ) : (
            filteredCourses?.map((course: any) => (
              <Card key={course.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-secondary/30 flex flex-col h-full overflow-hidden">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img 
                    src={course.thumbnailUrl} 
                    alt={course.title} 
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-background/80 backdrop-blur-md border-none text-primary font-bold">
                      {course.category}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>
                
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 mb-2 text-amber-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs text-muted-foreground ml-1">(4.9/5)</span>
                  </div>
                  
                  <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </CardTitle>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> 12h+ de contenu</span>
                    <span className="flex items-center gap-1"><Layers size={14} /> 8 modules</span>
                  </div>
                  
                  <Button className="w-full font-bold py-6 rounded-xl group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all" asChild>
                    <Link to="/courses/$id" params={{ id: course.id }}>Détails de la Formation</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </PageBody>
    </Page>
  )
}

// --- Course Detail Page ---
export function CourseDetailPage() {
  const { id } = useParams({ from: '/courses/$id' })

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => blink.db.courses.get(id)
  })

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons', id],
    queryFn: () => blink.db.lessons.list({ where: { courseId: id }, orderBy: { orderIndex: 'asc' } })
  })

  if (courseLoading) return <Skeleton className="h-[80vh] w-full" />
  if (!course) return <div>Cours non trouvé.</div>

  return (
    <Page>
      <PageHeader className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <Badge size="lg" className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-bold">
               {course.category}
            </Badge>
            <PageTitle className="text-5xl font-black tracking-tighter leading-none">
              {course.title}
            </PageTitle>
            <PageDescription className="text-xl text-muted-foreground leading-relaxed">
              {course.description}
            </PageDescription>
            <div className="flex items-center gap-6 py-4">
               <div className="flex items-center gap-2 text-sm font-medium">
                 <ShieldCheck className="text-primary" /> Certifié sécurisé
               </div>
               <div className="flex items-center gap-2 text-sm font-medium">
                 <Star className="text-amber-400" fill="currentColor" /> Meilleur vendeur
               </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 animate-fade-in [animation-delay:200ms]">
            <img src={course.thumbnailUrl} className="w-full h-full object-cover aspect-video" alt={course.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          </div>
        </div>
      </PageHeader>

      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Layers className="text-primary" />
              Programme de formation
            </h2>
            <div className="space-y-3">
              {lessonsLoading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)
              ) : (
                lessons?.map((lesson: any) => (
                  <Link 
                    key={lesson.id} 
                    to="/lessons/$id" 
                    params={{ id: lesson.id }}
                    className="flex items-center gap-4 p-5 rounded-xl border border-border/50 bg-secondary/30 hover:bg-primary/10 hover:border-primary/30 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-sm group-hover:text-primary transition-colors">
                      {lesson.orderIndex}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{lesson.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                         <span className="flex items-center gap-1"><Video size={12} /> Vidéo</span>
                         <span className="flex items-center gap-1"><Clock size={12} /> 15:00</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                       <PlayCircle size={20} />
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5 sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Prêt à démarrer ?</CardTitle>
                <p className="text-sm text-muted-foreground">Accédez instantanément à vie aux ressources et à l'IA.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full py-8 text-xl font-bold rounded-xl" size="lg" asChild>
                  {lessons?.[0] ? (
                    <Link to="/lessons/$id" params={{ id: lessons[0].id }}>Commencer Maintenant</Link>
                  ) : (
                    <span>Indisponible</span>
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  Garantie de satisfaction 30 jours. Certificat inclus.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

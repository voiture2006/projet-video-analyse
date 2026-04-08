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
  Input, 
  Avatar, 
  AvatarFallback, 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  Skeleton,
  Banner
} from '@blinkdotnew/ui'
import { 
  Send, 
  ChevronLeft, 
  ShieldCheck, 
  PlayCircle, 
  CheckCircle2, 
  HelpCircle,
  Video,
  FileText
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blink } from '../lib/blink'
import { Link, useParams } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'

// --- MiniChat Component ---
function MiniChat({ context }: { context: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Bonjour ! Je suis votre assistant de formation. Posez-moi vos questions sur cette leçon.' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isTyping) return
    
    const userMessage = { role: 'user' as const, content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const { text } = await blink.ai.generateText({
        messages: [
          { role: 'system', content: `Vous êtes un assistant pédagogique expert en ${context}. Répondez aux questions des étudiants de manière claire et concise.` },
          ...messages,
          userMessage
        ]
      })
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, j'ai rencontré une erreur. Réessayez." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Card className="flex flex-col h-[500px] lg:h-full border-border/50 bg-secondary/30">
      <CardHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <CardTitle className="text-sm font-semibold">Assistant IA (Direct)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className={m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/50'}>
                {m.role === 'user' ? 'U' : 'IA'}
              </AvatarFallback>
            </Avatar>
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
              m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-accent/50 text-foreground rounded-tl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-3">
             <Avatar className="h-8 w-8 animate-pulse"><AvatarFallback>...</AvatarFallback></Avatar>
             <div className="p-3 rounded-2xl bg-accent/50 text-xs text-muted-foreground">L'IA réfléchit...</div>
          </div>
        )}
      </CardContent>
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur">
        <div className="flex gap-2">
          <Input 
            placeholder="Posez une question..." 
            value={input} 
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="bg-background border-border/50"
          />
          <Button size="icon" onClick={handleSend} disabled={isTyping}>
            <Send size={18} />
          </Button>
        </div>
      </div>
    </Card>
  )
}

// --- Lesson Player Page ---
export function LessonPlayerPage() {
  const { id } = useParams({ from: '/lessons/$id' })
  const queryClient = useQueryClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    blink.auth.me().then(setUser)
  }, [])

  const { data: lesson, isLoading } = useQuery({
    queryKey: ['lesson', id],
    queryFn: () => blink.db.lessons.get(id)
  })

  const { data: course } = useQuery({
    queryKey: ['course', lesson?.courseId],
    queryFn: () => lesson ? blink.db.courses.get(lesson.courseId) : Promise.resolve(null),
    enabled: !!lesson
  })

  const { mutate: markComplete } = useMutation({
    mutationFn: () => {
      if (!user) return Promise.resolve()
      return blink.db.userProgress.upsert({
        id: `${user.id}_${id}_progress`,
        userId: user.id,
        courseId: lesson.courseId,
        lessonId: id,
        status: 'completed'
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] })
      queryClient.invalidateQueries({ queryKey: ['user_progress'] })
    }
  })

  if (isLoading) return <Skeleton className="h-[80vh] w-full" />
  if (!lesson) return <div>Leçon non trouvée.</div>

  // Handle YouTube URL to Embed
  const embedUrl = lesson.videoUrl?.includes('youtube.com/watch?v=') 
    ? lesson.videoUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/')
    : lesson.videoUrl

  return (
    <Page>
      <PageHeader className="flex flex-row items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/courses/$id" params={{ id: lesson.courseId }}>
            <ChevronLeft size={24} />
          </Link>
        </Button>
        <div>
          <PageTitle className="text-2xl font-bold">{lesson.title}</PageTitle>
          <PageDescription>{course?.title}</PageDescription>
        </div>
        <div className="ml-auto">
           <Button onClick={() => markComplete()} className="gap-2">
             <CheckCircle2 size={18} />
             Marquer comme terminé
           </Button>
        </div>
      </PageHeader>

      <PageBody>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-border/50 shadow-2xl">
              <iframe 
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title={lesson.title}
              />
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-secondary/30">
                <TabsTrigger value="overview" className="gap-2">
                  <PlayCircle size={16} /> Aperçu
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-2">
                  <FileText size={16} /> Ressources
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4 space-y-4 bg-secondary/10 rounded-xl mt-2 border border-border/20">
                <h3 className="text-lg font-semibold">À propos de cette leçon</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {lesson.content || "Cette leçon couvre les concepts fondamentaux de " + lesson.title + ". Suivez attentivement la vidéo pour maîtriser les outils et techniques présentés."}
                </p>
                <Banner variant="info" className="bg-primary/10 border-primary/20 text-primary-foreground">
                   Une question sur cette vidéo ? Utilisez l'Assistant IA à droite pour obtenir une réponse instantanée.
                </Banner>
              </TabsContent>
              <TabsContent value="resources" className="p-4 bg-secondary/10 rounded-xl mt-2 border border-border/20">
                <p className="text-sm text-muted-foreground">Aucune ressource supplémentaire pour le moment.</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="h-full">
             <MiniChat context={course?.title || 'Informatique'} />
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

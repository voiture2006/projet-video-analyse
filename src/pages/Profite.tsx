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
  Avatar, 
  AvatarFallback, 
  Badge, 
  Skeleton, 
  StatGroup, 
  Stat, 
  Progress 
} from '@blinkdotnew/ui'
import { 
  User, 
  Settings, 
  Award, 
  Star, 
  ShieldCheck, 
  Code, 
  Zap, 
  Calendar, 
  Lock 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { blink } from '../lib/blink'
import { useEffect, useState } from 'react'

export function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    blink.auth.me().then(setUser)
  }, [])

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ['user_progress'],
    queryFn: () => blink.db.userProgress.list()
  })

  const completedLessons = progress?.filter((p: any) => p.status === 'completed').length || 0
  const totalLessons = 20 // Mock total
  const progressPercent = Math.round((completedLessons / totalLessons) * 100)

  return (
    <Page>
      <PageHeader className="mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8 animate-fade-in">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <Avatar className="h-28 w-28 border-4 border-background relative shadow-2xl">
              <AvatarFallback className="bg-secondary text-primary text-4xl font-bold">
                {user?.email?.[0].toUpperCase() || <User size={48} />}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-background" />
          </div>
          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <PageTitle className="text-4xl font-black tracking-tight">{user?.displayName || user?.email?.split('@')[0]}</PageTitle>
              <Badge className="bg-primary text-primary-foreground font-bold border-none">MEMBRE PREMIUM</Badge>
            </div>
            <PageDescription className="text-lg flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Spécialisation : Cybersécurité & React
            </PageDescription>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
               <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                  <Calendar size={14} /> Membre depuis : Avril 2026
               </div>
               <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                  <Zap size={14} className="text-amber-400" /> Série d'apprentissage : 5 jours
               </div>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2 border-border/50 hover:bg-accent/50"><Settings size={18} /> Gérer</Button>
             <Button className="gap-2 shadow-lg shadow-primary/20"><Award size={18} /> Certificats</Button>
          </div>
        </div>
      </PageHeader>

      <PageBody className="space-y-12">
        <StatGroup className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Stat 
            label="Cours Suivis" 
            value="3" 
            icon={<BookOpen className="text-primary" />} 
          />
          <Stat 
            label="Leçons Terminées" 
            value={completedLessons.toString()} 
            icon={<Award className="text-emerald-400" />} 
          />
          <Stat 
            label="Points d'Expérience" 
            value="1,250 XP" 
            icon={<Star className="text-amber-400" fill="currentColor" />} 
          />
        </StatGroup>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="text-primary" />
              Progression Globale
            </h2>
            <Card className="border-border/50 bg-secondary/30 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <ShieldCheck size={120} />
              </div>
              <CardContent className="p-8 space-y-8 relative">
                <div className="flex items-end justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Niveau de Maîtrise</p>
                    <p className="text-4xl font-black text-primary">Intermédiaire</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{progressPercent}% complété</p>
                  </div>
                </div>
                <div className="space-y-2">
                   <Progress value={progressPercent} className="h-4 bg-background border border-border/20" />
                   <p className="text-xs text-muted-foreground text-center">Plus que 5 leçons pour débloquer le certificat de Cybersécurité Niveau 1.</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                   <div className="bg-background/40 p-4 rounded-xl border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">Forces</p>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mr-2">Network Security</Badge>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">React Hooks</Badge>
                   </div>
                   <div className="bg-background/40 p-4 rounded-xl border border-border/20">
                      <p className="text-xs text-muted-foreground mb-1">À Améliorer</p>
                      <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mr-2">Cryptography</Badge>
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Tailwind Grid</Badge>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Lock className="text-primary" />
              Prochaines Étapes
            </h2>
            <div className="space-y-4">
               {[
                 { title: 'Examen de Cybersécurité', desc: 'Testez vos connaissances sur les menaces.', icon: <ShieldCheck size={18} /> },
                 { title: 'Projet React Avancé', desc: 'Créez une application fullstack sécurisée.', icon: <Code size={18} /> },
                 { title: 'Challenge Bug Bounty', desc: 'Identifiez des vulnérabilités critiques.', icon: <ShieldCheck size={18} /> }
               ].map((item, i) => (
                 <Card key={i} className="border-border/50 bg-secondary/30 hover:border-primary/30 transition-all group cursor-pointer">
                    <CardContent className="p-5 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary shadow-sm border border-border/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          {item.icon}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                       </div>
                       <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">Continuer</Button>
                    </CardContent>
                 </Card>
               ))}
            </div>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

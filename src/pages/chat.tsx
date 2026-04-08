import { 
  Page, 
  PageHeader, 
  PageTitle, 
  PageDescription, 
  PageBody, 
  Card, 
  CardContent, 
  Button, 
  Input, 
  Avatar, 
  AvatarFallback, 
  Skeleton,
  Banner
} from '@blinkdotnew/ui'
import { 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  LifeBuoy, 
  Cpu, 
  Database, 
  Globe 
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { blink } from '../lib/blink'

export function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Bonjour ! Je suis votre conseiller en cybersécurité et tech. Comment puis-je vous aider aujourd\'hui ?' }
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
          { role: 'system', content: `Vous êtes un expert en cybersécurité, développement web et technologies numériques pour la plateforme SecureLearn. Aidez les utilisateurs avec leurs questions techniques, d'orientation professionnelle ou de support technique.` },
          ...messages,
          userMessage
        ]
      })
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Une erreur est survenue lors de la communication avec l'expert IA. Veuillez réessayer." }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <Page className="h-full flex flex-col">
      <PageHeader className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <PageTitle className="text-2xl font-bold">Support Expert & Chat IA</PageTitle>
            <PageDescription className="text-sm">Conseils personnalisés en direct sur vos formations et projets tech.</PageDescription>
          </div>
        </div>
      </PageHeader>

      <PageBody className="flex-1 min-h-0 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          <div className="lg:col-span-3 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col border-border/50 bg-secondary/30 min-h-0 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-background/50 backdrop-blur flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold">Conseiller Tech Interactif</span>
                </div>
                <div className="flex gap-2">
                   <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">Agent Sécurisé</Badge>
                   <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground border-border/20">Crypté (AES-256)</Badge>
                </div>
              </div>
              
              <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <Avatar className={`h-10 w-10 border-2 ${m.role === 'user' ? 'border-primary/50' : 'border-secondary-foreground/20'}`}>
                      <AvatarFallback className={m.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-background shadow-inner'}>
                        {m.role === 'user' ? 'Moi' : <LifeBuoy size={20} className="text-primary" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`p-4 rounded-3xl max-w-[80%] text-sm shadow-sm leading-relaxed ${
                      m.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-accent/40 text-foreground rounded-tl-none border border-border/30'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start gap-4">
                     <Avatar className="h-10 w-10 animate-pulse bg-secondary border-2 border-border/20 flex items-center justify-center">
                        <Cpu size={20} className="text-primary" />
                     </Avatar>
                     <div className="p-4 rounded-3xl bg-accent/40 text-xs text-muted-foreground italic border border-border/30 rounded-tl-none">
                        L'expert IA analyse votre demande...
                     </div>
                  </div>
                )}
              </CardContent>

              <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md">
                <div className="flex gap-3 relative max-w-4xl mx-auto">
                  <Input 
                    placeholder="Posez votre question technique ou demandez un conseil d'orientation..." 
                    value={input} 
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    className="py-6 px-6 bg-background/80 border-border/50 rounded-2xl focus:ring-primary/40 focus:border-primary/40 text-base"
                  />
                  <Button 
                    size="lg" 
                    onClick={handleSend} 
                    disabled={isTyping} 
                    className="rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  >
                    <Send size={20} />
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-4">
                  Ce chat utilise l'IA pour le support. Pour une assistance technique critique, veuillez ouvrir un ticket.
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-6 hidden lg:block">
            <Card className="border-border/50 bg-secondary/30 overflow-hidden group">
               <div className="h-1 bg-primary group-hover:bg-primary/80 transition-all" />
               <CardContent className="p-5 space-y-4">
                 <h3 className="font-bold flex items-center gap-2">
                   <ShieldCheck className="text-primary w-5 h-5" />
                   Pourquoi SecureLearn ?
                 </h3>
                 <div className="space-y-3">
                   {[
                     { icon: <Cpu size={14} />, text: 'IA Spécialisée en Tech' },
                     { icon: <Database size={14} />, text: 'Données Cryptées' },
                     { icon: <Globe size={14} />, text: 'Contenu Certifié' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground p-2 rounded-lg bg-background/50 border border-border/20">
                        {item.icon}
                        {item.text}
                     </div>
                   ))}
                 </div>
               </CardContent>
            </Card>

            <Banner variant="info" className="bg-primary/10 border-primary/20 text-primary-foreground text-xs leading-tight">
               Besoin d'un mentor humain ? Nos sessions de coaching hebdomadaires sont disponibles pour les membres Pro.
            </Banner>
          </div>
        </div>
      </PageBody>
    </Page>
  )
}

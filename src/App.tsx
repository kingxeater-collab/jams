import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, 
  Scissors, 
  Palette, 
  Home, 
  History, 
  Settings, 
  Crown, 
  Download, 
  Zap,
  Sparkles,
  Image as ImageIcon,
  Mic,
  FileText,
  Layout,
  ChevronRight,
  LogOut,
  User as UserIcon,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ToolCard } from './components/ToolCard';
import { geminiService } from './services/geminiService';
import { User, Project, Plan } from './types';

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Plano Gratuito',
    price: 'Grátis',
    limit: '3 vezes no total',
    features: ['Acesso limitado às IAs', 'Qualidade padrão', 'Exportação básica']
  },
  {
    id: 'pro',
    name: 'Plano Pro',
    price: '12.890 Kz/mês',
    limit: '3 vezes por dia',
    features: ['Mais templates e modelos', 'Melhor qualidade', 'Suporte prioritário']
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    price: '30.000 Kz/mês',
    limit: 'Uso ilimitado',
    features: ['Todas as ferramentas de IA', 'Alta qualidade (4K)', 'Processamento prioritário', 'Sem marca d\'água']
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
    fetchProjects();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user", err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const handleUpgrade = async (planId: string) => {
    try {
      await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      });
      fetchUser();
      setActiveTab('home');
    } catch (err) {
      console.error("Error upgrading plan", err);
    }
  };

  const renderSidebar = () => (
    <div className="w-64 h-screen border-r border-white/10 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">ViralStudio <span className="text-brand-primary">AI</span></h1>
      </div>

      <nav className="flex-1 space-y-2">
        {[
          { id: 'home', label: 'Início', icon: Home },
          { id: 'projects', label: 'Histórico', icon: History },
          { id: 'library', label: 'Biblioteca IA', icon: Sparkles },
          { id: 'downloads', label: 'Downloads', icon: Download },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-brand-primary/10 text-brand-primary font-medium' 
                : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        {user && user.plan !== 'premium' && (
          <button 
            onClick={() => setActiveTab('pricing')}
            className="w-full p-4 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-transform"
          >
            <Crown className="w-4 h-4" />
            Upgrade para Pro
          </button>
        )}
        
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">Usuário Viral</p>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">{user?.plan}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-bold">
              <span>Uso do Plano</span>
              <span>{user?.usage_count} / {user?.plan === 'free' ? '3' : user?.plan === 'pro' ? '3/dia' : '∞'}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-primary transition-all duration-500" 
                style={{ width: `${Math.min((user?.usage_count || 0) / 3 * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-12">
      <header>
        <h2 className="text-4xl font-extrabold mb-4">Bem-vindo ao <span className="gradient-text">ViralStudio AI</span></h2>
        <p className="text-zinc-400 text-lg max-w-2xl">Crie conteúdos virais em segundos. Escolha uma ferramenta para começar sua jornada de criação.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToolCard 
          title="Criar Vídeo com IA"
          description="Transforme roteiros ou ideias em vídeos completos com narração e música."
          icon={Video}
          variant="primary"
          onClick={() => setActiveTab('create-video')}
        />
        <ToolCard 
          title="Vídeo Longo para Shorts"
          description="Extraia os melhores momentos de vídeos longos automaticamente."
          icon={Scissors}
          variant="secondary"
          onClick={() => setActiveTab('long-to-short')}
        />
        <ToolCard 
          title="Criar Design com IA"
          description="Gere thumbnails, posts e banners profissionais instantaneamente."
          icon={Palette}
          variant="accent"
          onClick={() => setActiveTab('create-design')}
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Projetos Recentes</h3>
          <button onClick={() => setActiveTab('projects')} className="text-brand-primary text-sm font-medium flex items-center gap-1 hover:underline">
            Ver todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {projects.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-zinc-500">
            <History className="w-12 h-12 mb-4 opacity-20" />
            <p>Você ainda não criou nenhum projeto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.slice(0, 4).map((project) => (
              <div key={project.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <div className="aspect-video rounded-xl bg-zinc-900 mb-3 flex items-center justify-center overflow-hidden relative">
                  {project.type === 'video' ? <Video className="w-8 h-8 text-brand-primary" /> : 
                   project.type === 'short' ? <Scissors className="w-8 h-8 text-brand-secondary" /> : 
                   <Palette className="w-8 h-8 text-brand-accent" />}
                </div>
                <h4 className="font-semibold truncate">{project.title}</h4>
                <p className="text-xs text-zinc-500 mt-1 capitalize">{project.type} • {new Date(project.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderCreateVideo = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
      if (!prompt) return;
      setLoading(true);
      setError(null);
      try {
        const script = await geminiService.generateScript(prompt);
        const voice = await geminiService.generateVoice(script.hook + " " + script.body);
        
        const newProject = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'video',
          title: script.title || prompt,
          content: { script, voice }
        };

        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Erro ao criar projeto");
        }

        setResult(newProject.content);
        fetchUser();
        fetchProjects();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <button onClick={() => setActiveTab('home')} className="p-2 rounded-xl hover:bg-white/5">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <div>
            <h2 className="text-3xl font-bold">Criar Vídeo com IA</h2>
            <p className="text-zinc-400">Descreva o tema ou roteiro do seu vídeo.</p>
          </div>
        </header>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">O que você quer criar?</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Um vídeo motivacional sobre superação e foco nos estudos..."
              className="w-full h-32 bg-zinc-900 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-brand-primary outline-none resize-none transition-all"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading || !prompt}
              className="w-full py-4 rounded-2xl bg-brand-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-brand-primary/90 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Gerar Vídeo Viral
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-brand-accent" />
                  Vídeo Gerado com Sucesso!
                </h3>
                <button className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase">Roteiro Sugerido</h4>
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 text-sm space-y-3">
                    <p><strong className="text-brand-primary">Gancho:</strong> {result.script.hook}</p>
                    <p>{result.script.body}</p>
                    <p><strong className="text-brand-secondary">CTA:</strong> {result.script.callToAction}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-zinc-500 uppercase">Narração (IA Voice)</h4>
                  {result.voice && (
                    <audio controls src={result.voice} className="w-full" />
                  )}
                  <div className="aspect-video rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5">
                    <Video className="w-12 h-12 text-zinc-700" />
                    <p className="absolute text-xs text-zinc-500 mt-20">Preview do Vídeo</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  const renderCreateDesign = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
      if (!prompt) return;
      setLoading(true);
      setError(null);
      try {
        const image = await geminiService.generateImage(prompt);
        if (!image) throw new Error("Falha ao gerar imagem");
        
        const newProject = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'design',
          title: prompt,
          content: { imageUrl: image }
        };

        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProject)
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Erro ao criar projeto");
        }

        setImageUrl(image);
        fetchUser();
        fetchProjects();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <button onClick={() => setActiveTab('home')} className="p-2 rounded-xl hover:bg-white/5">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <div>
            <h2 className="text-3xl font-bold">Criar Design com IA</h2>
            <p className="text-zinc-400">Gere thumbnails, posts e banners profissionais.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <label className="block text-sm font-medium text-zinc-400 uppercase tracking-wider">O que você quer desenhar?</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Uma thumbnail para YouTube sobre 'Como ganhar dinheiro com IA' com cores vibrantes e estilo moderno..."
                className="w-full h-32 bg-zinc-900 border border-white/10 rounded-2xl p-4 focus:ring-2 focus:ring-brand-accent outline-none resize-none transition-all"
              />
              <button 
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="w-full py-4 rounded-2xl bg-brand-accent text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-brand-accent/90 transition-colors"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Palette className="w-5 h-5" />}
                Gerar Design
              </button>
            </div>
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}
          </div>

          <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated Design" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button className="absolute bottom-4 right-4 p-3 rounded-xl bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="text-center p-8">
                <ImageIcon className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500">Seu design aparecerá aqui.</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-brand-accent animate-spin mb-4" />
                <p className="text-sm font-medium">A IA está desenhando...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPricing = () => (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-extrabold">Escolha o seu <span className="gradient-text">Plano</span></h2>
        <p className="text-zinc-400 text-lg">Desbloqueie todo o potencial da IA para suas criações.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.id} 
            className={`p-8 rounded-3xl border flex flex-col transition-all duration-300 ${
              plan.id === 'pro' 
                ? 'bg-gradient-to-b from-brand-primary/20 to-zinc-900 border-brand-primary/50 scale-105 shadow-2xl shadow-brand-primary/20' 
                : 'bg-zinc-900 border-white/10 hover:border-white/20'
            }`}
          >
            {plan.id === 'pro' && (
              <div className="self-start px-3 py-1 rounded-full bg-brand-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                Mais Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              {plan.id !== 'free' && <span className="text-zinc-500 text-sm">/mês</span>}
            </div>
            
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-8">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Limite de Uso</p>
              <p className="text-sm font-medium">{plan.limit}</p>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-brand-accent shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handleUpgrade(plan.id)}
              disabled={user?.plan === plan.id}
              className={`w-full py-4 rounded-2xl font-bold transition-all ${
                user?.plan === plan.id 
                  ? 'bg-zinc-800 text-zinc-500 cursor-default' 
                  : plan.id === 'pro'
                    ? 'bg-brand-primary text-white hover:bg-brand-primary/90'
                    : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {user?.plan === plan.id ? 'Plano Atual' : 'Selecionar Plano'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold">Biblioteca de <span className="gradient-text">Ferramentas IA</span></h2>
        <p className="text-zinc-400">Todas as ferramentas que você precisa em um só lugar.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Edição Automática', icon: Video, desc: 'Corte e ajuste vídeos com IA.' },
          { title: 'Geração de Imagens', icon: ImageIcon, desc: 'Crie visuais únicos do zero.' },
          { title: 'Design de Posts', icon: Layout, desc: 'Templates inteligentes para redes sociais.' },
          { title: 'Roteiros Virais', icon: FileText, desc: 'Scripts otimizados para engajamento.' },
          { title: 'Voz para Vídeos', icon: Mic, desc: 'Narração profissional em vários idiomas.' },
          { title: 'Legendas Automáticas', icon: Sparkles, desc: 'Gere legendas dinâmicas e precisas.' },
        ].map((tool, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <tool.icon className="w-6 h-6 text-brand-primary" />
            </div>
            <h4 className="text-lg font-bold mb-1">{tool.title}</h4>
            <p className="text-sm text-zinc-500">{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Histórico de Projetos</h2>
          <p className="text-zinc-400">Gerencie e baixe suas criações anteriores.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
          <Plus className="w-4 h-4" /> Novo Projeto
        </button>
      </header>

      {projects.length === 0 ? (
        <div className="p-20 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-zinc-500">
          <History className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-lg">Nenhum projeto encontrado.</p>
          <button onClick={() => setActiveTab('home')} className="mt-4 text-brand-primary font-medium hover:underline">Começar a criar</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="group relative rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-brand-primary/50 transition-all">
              <div className="aspect-video bg-zinc-900 flex items-center justify-center relative">
                {project.type === 'video' ? <Video className="w-10 h-10 text-brand-primary opacity-40" /> : 
                 project.type === 'short' ? <Scissors className="w-10 h-10 text-brand-secondary opacity-40" /> : 
                 <Palette className="w-10 h-10 text-brand-accent opacity-40" />}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold truncate flex-1">{project.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    project.type === 'video' ? 'bg-brand-primary/20 text-brand-primary' : 
                    project.type === 'short' ? 'bg-brand-secondary/20 text-brand-secondary' : 
                    'bg-brand-accent/20 text-brand-accent'
                  }`}>
                    {project.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">{new Date(project.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex bg-zinc-950 min-h-screen">
      {renderSidebar()}
      
      <main className="flex-1 p-10 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'home' && renderHome()}
            {activeTab === 'create-video' && renderCreateVideo()}
            {activeTab === 'create-design' && renderCreateDesign()}
            {activeTab === 'library' && renderLibrary()}
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'pricing' && renderPricing()}
            {activeTab === 'long-to-short' && (
              <div className="max-w-4xl mx-auto text-center py-20 space-y-6">
                <Scissors className="w-20 h-20 text-brand-secondary mx-auto mb-4" />
                <h2 className="text-3xl font-bold">Vídeo Longo para Shorts</h2>
                <p className="text-zinc-400 text-lg">Esta funcionalidade requer upload de vídeo. Em breve você poderá processar seus vídeos longos aqui.</p>
                <button onClick={() => setActiveTab('home')} className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                  Voltar ao Início
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

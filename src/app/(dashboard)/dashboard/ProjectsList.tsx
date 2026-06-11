'use client';

import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase';
import { Copy, Settings, Plus, Trash2, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface Project {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  created_at: string;
}

interface Props {
  initialProjects: Project[];
  userId: string;
  isSubscribed: boolean;
}

export default function ProjectsList({ initialProjects, userId, isSubscribed }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const supabase = createBrowserSupabase();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) return;
    setCreating(true);

    const { data: project } = (await supabase
      .from('projects')
      .insert({ name, domain: domain.replace(/^https?:\/\//, ''), user_id: userId } as unknown as never)
      .select()
      .single()) as unknown as { data: Project | null };

    if (project) {
      // Varsayilan widget ayarlarini olustur
      await supabase.from('project_settings').insert({ project_id: project.id } as unknown as never);
      setProjects([project, ...projects]);
      setName('');
      setDomain('');
      router.refresh();
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const copyScript = (id: string) => {
    const script = `<script src="${window.location.origin}/api/widget?id=${id}"></script>`;
    navigator.clipboard.writeText(script);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      {/* Yeni Proje Olustur */}
      <SpotlightCard className="p-6 mb-6 hover:border-white/10 transition-all duration-300">
        <h2 className="text-lg font-semibold mb-4 text-white">Create New Project</h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Project name (e.g. My SaaS)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
          <input
            type="text"
            placeholder="Domain (e.g. mysaas.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
          <button
            type="submit"
            disabled={creating}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 border border-indigo-500/50 shadow-lg shadow-indigo-500/25 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            <Plus size={16} className={creating ? 'animate-spin' : ''} />
            {creating ? 'Creating...' : 'Add Project'}
          </button>
        </form>
      </SpotlightCard>

      {/* Proje Listesi */}
      {projects.length === 0 ? (
        <SpotlightCard className="p-12 text-center">
          <div className="text-4xl mb-3">🌍</div>
          <h3 className="font-semibold text-lg mb-2 text-white">No projects yet</h3>
          <p className="text-zinc-400 text-sm">Create your first project above to get started.</p>
        </SpotlightCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <SpotlightCard key={project.id} className="p-5 hover:border-white/10 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-white">{project.name}</h3>
                  <p className="text-sm text-zinc-400 mt-0.5">{project.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all hover:shadow-md"
                  >
                    <Settings size={14} />
                    Configure
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Embed Kodu */}
              <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Embed Script</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-indigo-300 flex-1 truncate font-mono">
                    {`<script src="${window.location.origin}/api/widget?id=${project.id}"></script>`}
                  </code>
                  <button
                    onClick={() => copyScript(project.id)}
                    className="flex items-center gap-1.5 text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 px-3 py-1.5 rounded-md transition-all flex-shrink-0"
                  >
                    {copiedId === project.id ? (
                      <><Check size={14} /> Copied!</>
                    ) : (
                      <><Copy size={14} /> Copy</>
                    )}
                  </button>
                </div>
              </div>

              {/* Test linki */}
              {!isSubscribed && (
                <p className="text-xs text-amber-500/70 mt-3">
                  ⚠️ Widget inactive — upgrade to enable on live sites
                </p>
              )}
            </SpotlightCard>
          ))}
        </div>
      )}
    </div>
  );
}

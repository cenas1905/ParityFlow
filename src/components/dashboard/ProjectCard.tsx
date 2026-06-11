import React from 'react';
import Link from 'next/link';
import { Settings, Trash2, Check, Copy } from 'lucide-react';
import SpotlightCard from '@/components/ui/SpotlightCard';

interface Project {
  id: string;
  name: string;
  domain: string;
  is_active: boolean;
  created_at: string;
}

interface ProjectCardProps {
  project: Project;
  isSubscribed: boolean;
  copiedId: string | null;
  onCopyScript: (id: string) => void;
  onDelete: (id: string) => void;
  origin: string; // pass window.location.origin from client safely
}

export default function ProjectCard({ project, isSubscribed, copiedId, onCopyScript, onDelete, origin }: ProjectCardProps) {
  return (
    <SpotlightCard className="p-5 hover:border-white/10 transition-all duration-300">
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
            onClick={() => onDelete(project.id)}
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
            {`<script src="${origin}/api/widget?id=${project.id}"></script>`}
          </code>
          <button
            onClick={() => onCopyScript(project.id)}
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
  );
}

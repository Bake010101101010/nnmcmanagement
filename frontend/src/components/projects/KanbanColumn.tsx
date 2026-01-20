import { useDroppable } from '@dnd-kit/core';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Project, BoardStage } from '../../types';
import ProjectCard from './ProjectCard';

interface KanbanColumnProps {
  stage: BoardStage;
  stageName: string;
  projects: Project[];
  onProjectClick: (documentId: string) => void;
  canDrag: boolean;
}

export default function KanbanColumn({
  stage,
  stageName,
  projects,
  onProjectClick,
  canDrag,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-72 flex-shrink-0 flex flex-col rounded-xl transition-colors ${
        isOver ? 'bg-primary-50' : 'bg-slate-100'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <h3 className="font-semibold text-slate-700">{stageName}</h3>
          <span className="ml-auto px-2 py-0.5 bg-white rounded-full text-xs font-medium text-slate-500">
            {projects.length}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {stage.minPercent}% – {stage.maxPercent}%
        </p>
      </div>

      {/* Projects */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {projects.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            Нет проектов
          </div>
        ) : (
          projects.map((project) => (
            <DraggableProjectCard
              key={project.id}
              project={project}
              onProjectClick={onProjectClick}
              canDrag={canDrag}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface DraggableProjectCardProps {
  project: Project;
  onProjectClick: (documentId: string) => void;
  canDrag: boolean;
}

function DraggableProjectCard({ project, onProjectClick, canDrag }: DraggableProjectCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.documentId,
    disabled: !canDrag,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(canDrag ? { ...listeners, ...attributes } : {})}
      className={canDrag ? 'cursor-grab active:cursor-grabbing' : ''}
    >
      <ProjectCard
        project={project}
        onClick={() => onProjectClick(project.documentId)}
        isDragging={isDragging}
      />
    </div>
  );
}

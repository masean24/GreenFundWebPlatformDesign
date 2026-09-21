import { Link } from "react-router-dom";
import { MapPin, Users, Clock } from "lucide-react";
import { type Project, formatRupiah, categoryLabels, categoryColors } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = Math.min((project.raised / project.goal) * 100, 100);

  return (
    <Link
      to={`/project/${project.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-48 bg-[#E7F5EA] overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 outline outline-1 -outline-offset-1 outline-black/10"
        />
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: categoryColors[project.category] }}
          >
            {categoryLabels[project.category]}
          </span>
        </div>
        {project.status === "funded" && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-[#14432B]">
            Fully Funded ✓
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin size={12} className="text-[#9CA3AF]" />
          <span className="text-xs text-[#9CA3AF]">{project.location}</span>
        </div>

        <h3 className="font-semibold text-[#1E2A26] text-sm leading-snug mb-2 group-hover:text-[#14432B] transition-colors line-clamp-2">
          {project.title}
        </h3>
        <p className="text-xs text-[#6B7280] leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-[#14432B]">{formatRupiah(project.raised)}</span>
            <span className="text-xs text-[#9CA3AF]">of {formatRupiah(project.goal)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#E7F5EA] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#4CAF50] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-xs font-medium text-[#4CAF50]">{Math.round(progress)}% funded</span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users size={12} className="text-[#9CA3AF]" />
              <span className="text-xs text-[#9CA3AF]">{project.backers.toLocaleString()}</span>
            </div>
            {project.daysLeft > 0 && (
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-[#9CA3AF]" />
                <span className="text-xs text-[#9CA3AF]">{project.daysLeft}d left</span>
              </div>
            )}
          </div>
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#14432B] active:scale-[0.96] transition-transform duration-150">
            Support
          </span>
        </div>
      </div>
    </Link>
  );
}

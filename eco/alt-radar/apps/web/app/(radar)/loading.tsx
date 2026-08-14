import { PanelSkeleton } from "@/components/shared/query-state";

export default function RadarLoading() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="panel h-28">
            <PanelSkeleton rows={1} />
          </div>
        ))}
      </div>
      <div className="panel">
        <PanelSkeleton rows={7} />
      </div>
    </div>
  );
}

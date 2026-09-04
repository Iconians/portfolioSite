import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const TAB_ITEMS = [
  { value: "overview", label: "Overview" },
  { value: "media", label: "Media" },
  { value: "details", label: "Details" },
  { value: "story", label: "Story" },
  { value: "metrics", label: "Metrics" },
  { value: "evolution", label: "Evolution" },
  { value: "platform", label: "Platform" },
  { value: "links", label: "Links & SEO" },
] as const;

export function ProjectEditorTabList() {
  return (
    <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-muted/50 p-1">
      {TAB_ITEMS.map((tab) => (
        <TabsTrigger
          key={tab.value}
          value={tab.value}
          className="px-2.5 py-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm sm:text-sm"
        >
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabItem = {
  value: string;
  label: string;
  platformOnly?: boolean;
};

const TAB_ITEMS: TabItem[] = [
  { value: "overview", label: "Overview" },
  { value: "media", label: "Media" },
  { value: "details", label: "Details" },
  { value: "story", label: "Story" },
  { value: "presentation", label: "Presentation", platformOnly: true },
  { value: "metrics", label: "Metrics" },
  { value: "evolution", label: "Evolution" },
  { value: "platform", label: "Platform" },
  { value: "links", label: "Links & SEO" },
];

interface ProjectEditorTabListProps {
  showPresentation?: boolean;
}

export function ProjectEditorTabList({
  showPresentation = false,
}: ProjectEditorTabListProps) {
  const tabs = TAB_ITEMS.filter(
    (tab) => !tab.platformOnly || showPresentation
  );

  return (
    <TabsList className="flex h-auto w-full flex-wrap gap-1 bg-muted/50 p-1">
      {tabs.map((tab) => (
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

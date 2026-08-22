import { Inline } from "@/components/layout/Stack";
import { Heading } from "@/components/typography/Heading";
import { Badge } from "@/components/ui/badge";

interface AboutSkillsGroupProps {
  title: string;
  items: string[];
  listKey: string;
}

export function AboutSkillsGroup({
  title,
  items,
  listKey,
}: AboutSkillsGroupProps) {
  return (
    <>
      <Heading level={3} className="mb-4 text-center text-2xl">
        {title}
      </Heading>
      <Inline gap="sm" className="flex-wrap gap-2">
        {items.map((skill, index) => (
          <Badge key={`${listKey}-${skill}-${index}`} variant="secondary" className="text-sm">
            {skill}
          </Badge>
        ))}
      </Inline>
    </>
  );
}

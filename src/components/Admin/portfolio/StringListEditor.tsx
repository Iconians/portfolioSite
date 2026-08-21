"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StringListEditorProps {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function StringListEditor({
  label,
  description,
  values,
  onChange,
  disabled = false,
  placeholder = "Enter an item",
}: StringListEditorProps) {
  function updateItem(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <Label>{label}</Label>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-2 space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <Input
              value={value}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(event) => updateItem(index, event.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => removeItem(index)}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        className="mt-2"
        onClick={() => onChange([...values, ""])}
      >
        Add item
      </Button>
    </div>
  );
}

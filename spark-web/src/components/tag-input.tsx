"use client"

import { useState, type KeyboardEvent } from "react"
import { XIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

// Controlled chip-style tag input — press Enter to add, X to remove
export function TagInput({ value, onChange, placeholder = "Add a tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  // Adds the current input as a tag if non-empty and not a duplicate
  function addTag() {
    const trimmed = inputValue.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue("")
  }

  // Adds tag on Enter, allows Tab and comma as shortcuts too
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  // Removes a tag by its index
  function removeTag(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div className="flex flex-wrap gap-1.5 rounded-md border bg-transparent px-3 py-2 text-sm focus-within:ring-1 focus-within:ring-ring">
      {value.map((tag, i) => (
        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="ml-0.5 rounded-sm opacity-60 hover:opacity-100"
          >
            <XIcon className="size-3" />
          </button>
        </Badge>
      ))}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

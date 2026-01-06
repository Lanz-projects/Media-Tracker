"use client"

import * as React from 'react'
import { GripVertical, Trash2 } from 'lucide-react'
import { FrontendMetadata } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'

interface MetadataRowProps {
  metadata: FrontendMetadata
  existingKeys: string[]
  onUpdate: (updatedMetadata: FrontendMetadata) => void
  onRemove: () => void
}

export function MetadataRow({
  metadata,
  existingKeys,
  onUpdate,
  onRemove,
}: MetadataRowProps) {
  const handleKeyChange = (newKey: string) => {
    onUpdate({ ...metadata, key: newKey })
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...metadata, value: e.target.value })
  }

  const keyOptions = existingKeys.map((key) => ({ value: key, label: key }))

  return (
    <div className="flex items-center gap-2 group">
      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
      <div className="grid grid-cols-2 gap-2 flex-grow">
        <Combobox
          options={keyOptions}
          value={metadata.key}
          onChange={handleKeyChange}
          placeholder="Select a key"
          searchPlaceholder="Search or create..."
          emptyPlaceholder="No keys found."
          createPlaceholder="Create key"
        />
        <Input
          value={metadata.value}
          onChange={handleValueChange}
          placeholder="Enter value"
          className="bg-transparent border-[0.5px]"
        />
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  )
}

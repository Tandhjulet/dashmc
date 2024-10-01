import fs from 'fs'
import path from 'path'
import matter from 'gray-matter';
import { Collapsible } from '@/components/mdx/Collapsible';
import { Ol } from '@/components/mdx/List';
import { createHeading } from '@/components/mdx/Headers';

function readMDXFile(filePath: string) {
	const rawContent = fs.readFileSync(filePath, 'utf-8')
	return matter(rawContent)
}

export function readRules() {
	return readMDXFile(path.join(process.cwd(), 'src', 'app', '(general)', 'rules', 'rules.mdx'))
}

// ---- CUSTOM MDX COMPONENTS ----

export const components = {
	Collapsible: Collapsible,
	"ol": Ol,
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
} as const;
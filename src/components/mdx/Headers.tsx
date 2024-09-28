import React from "react"

function slugify(str: string) {
	return str
	  .toString()
	  .toLowerCase()
	  .trim() // Remove whitespace from both ends of a string
	  .replace(/\s+/g, '-') // Replace spaces with -
	  .replace(/&/g, '-and-') // Replace & with 'and'
	  .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
	  .replace(/\-\-+/g, '-') // Replace multiple - with single -
  }

export function createHeading(level: number) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const Heading = ({ children }: any) => {
	  const slug = slugify(children)
	  return React.createElement(
		`h${level}`,
		{
			id: slug,
			style: {
				textAlign: "start"
			}
		},
		[
		  React.createElement('a', {
			href: `#${slug}`,
			key: `link-${slug}`,
			className: 'anchor',
		  }),
		],
		children
	  )
	}
  
	Heading.displayName = `Heading${level}`
  
	return Heading
  }
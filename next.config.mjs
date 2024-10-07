import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	transpilePackages: ['next-mdx-remote'],
	output: "standalone",

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "minotar.net",
				pathname: "/helm/**",
			}
		],
	}
};

const withMDX = createMDX({

})

export default withMDX(nextConfig);

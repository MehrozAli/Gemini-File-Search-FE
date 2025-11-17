/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // The Docker image ships only the standalone server; local `npm start`
  // keeps the regular output.
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,
};

export default nextConfig;

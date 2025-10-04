import { domain } from './node_modules/@cloudinary-util/url-loader/node_modules/zod/src/v4/core/regexes';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"lh3.googleusercontent.com"
      }
    ],
    domains:[ "res.cloudinary.com"]
  }
};

export default nextConfig;

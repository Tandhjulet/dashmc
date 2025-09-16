<p align="center">
  <a href="https://dashmc.net">
    <picture>
      <img src="https://cdn.craftingstore.net/rPPmDHlLQ1/65166bb14cd8910362b73d6b98958230/67wlwtsvnufpuquuvvrt.png" height="128">
    </picture>
    <h1 align="center">DashMC</h1>
  </a>
</p>

<p align="center">
  <a href="https://creativecommons.org/licenses/by-nc/4.0/?ref=chooser-v1">
    <img src="https://img.shields.io/static/v1?label=License&message=CC-BY-NC-4.0&color=red">
  </a>
</p>

## Introduction
This is a full-stack web application built using modern tooling, including NextJS, Typescript, Prisma and MDX (for static pages). Using MariaDB and Redis it's a super-fast, yet modern panel. It is not available for commercial use, as per our license.

### Features
- Built-in minecraft and discord verification
- OAuth for Discord (verified accounts) and Google
- Forum pages created dynamically
- Multiple roles for users
- Uses Redis and caching features of NextJS for maximum speed
- *...and so much more!*

## Requirements
This application requires Node.js 20 (or higher) to run. You can use nvm (or alternatively download the pre-built package from Node.js' website), to install the required version of Node.js.

## Installation
Ensure you have working Redis and MariaDB/MySQL installations installed. The forum works unanimously with either database technology. Remember to fill out the `.env.example` file with your environment variables. Rename it to `.env` afterwards, for the environment variables to take effect.

Use `npm run build` followed by `npm run start` to build and run the application. Use a process management tool (like `pm2`) to ensure the applications runs continuesly. 

> [!CAUTION]
> Remember to filter ports of MySQL and **especially** Redis-installations. Redis is unsafe by default, and it is thus imperative to close/filter the ports through firewalls such as `ufw` or `iptables`.

To be able to access the site, you will need to set up account verification. This requires a trusted token, shared between your minecraft server and this web server. You can generate a key of length 32 through `openssl rand -base64 32`, but it is entirely up to you. The token *is sensitive, and should be handled as such*!

## ⚠️ WIP ⚠️
- Ratelimit
- Better containerization

## Security
If you believe you have found a vulnerability in DashMC, we highly encourage you to disclose this responsibly. Please do NOT open a public issue, as you will expose the issue. Thank you.

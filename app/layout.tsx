import '../styles/globals.css';
import React from 'react'


export const metadata = {
title: 'Smart Resume — Demo',
description: 'Smart resume components demo'
}


export default function RootLayout({ children }: { children: React.ReactNode }){
return (
<html lang="en">
<body>
<header className="w-full border-b border-white/6 py-4">
<div className="container-centered flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">SF</div>
<div>
<h1 className="text-lg font-semibold">Smart Resume</h1>
<p className="text-xs text-slate-300">Next.js + Tailwind demo</p>
</div>
</div>
<nav className="hidden md:flex items-center gap-4 text-sm text-slate-300">
<a href="#preview">Preview</a>
<a href="#skills">Skills</a>
<a href="#ai">AI</a>
<a href="#templates">Templates</a>
</nav>
</div>
</header>
<main className="py-8">{children}</main>
</body>
</html>
)
}
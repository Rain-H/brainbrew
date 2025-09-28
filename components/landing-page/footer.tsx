"use client"

export default function Footer() {
  return (
    <footer className="container mx-auto px-4 py-8 border-t border-border">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This website automatically curates public advertising cases for educational and inspirational purposes only.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          © {new Date().getFullYear()} CreativeHub. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

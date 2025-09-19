"use client";

import { Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import Image from "next/image";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/zentara-logo.png"
                alt="ZENTARA"
                width={320}
                height={46}
                quality={100}
                className="w-[132px] h-auto"
              />
            </div>
            <Badge variant="secondary" className="ml-4">
              <Activity className="h-3 w-3 mr-1" />
              Live Monitoring
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Threat Intelligence Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

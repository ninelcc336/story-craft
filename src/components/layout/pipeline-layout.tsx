"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface StepCardProps {
  title: string;
  step: number;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export function StepCard({
  title,
  step,
  badge,
  children,
  className,
}: StepCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-medium text-white">
          {step}
        </span>
        <CardTitle className="text-base">{title}</CardTitle>
        {badge && <Badge variant="secondary">{badge}</Badge>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

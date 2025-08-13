'use client';

import useLocalStorage from '@/hooks/use-local-storage';
import { initialRoadmap } from '@/lib/data';
import type { RoadmapItem } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, CircleDashed, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig = {
    'Completed': { icon: <CheckCircle className="w-6 h-6 text-green-400" />, badge: 'default' as const, glow: 'shadow-green-400/30' },
    'In Progress': { icon: <Rocket className="w-6 h-6 text-cyan-400" />, badge: 'secondary' as const, glow: 'shadow-cyan-400/30' },
    'Planned': { icon: <CircleDashed className="w-6 h-6 text-amber-400" />, badge: 'outline' as const, glow: 'shadow-amber-400/30' }
};

export default function RoadmapSection() {
    const [roadmap] = useLocalStorage<RoadmapItem[]>('rudybtz-roadmap', initialRoadmap);

    const sortedRoadmap = [...roadmap].sort((a, b) => {
        const statusOrder = { 'In Progress': 1, 'Planned': 2, 'Completed': 3 };
        return statusOrder[a.status] - statusOrder[b.status] || new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    });

    return (
        <div className="container mx-auto text-center">
            <h2 className="mb-4 text-4xl font-black tracking-wider uppercase md:text-6xl font-headline">Roadmap</h2>
            <p className="max-w-2xl mx-auto mb-12 text-lg text-foreground/70">
                The future is now. Here's a glimpse into the upcoming projects and milestones for RUDYBTZ.
            </p>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {sortedRoadmap.map((item) => {
                    const config = statusConfig[item.status];
                    return (
                        <Card key={item.id} className={cn(
                            "text-left transition-all duration-300 border-0 glassmorphism bg-card/50 hover:shadow-2xl hover:-translate-y-2",
                            config.glow
                        )}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-grow pr-4">
                                        <CardTitle className="font-headline text-xl mb-2">{item.title}</CardTitle>
                                        <Badge variant={config.badge}>{item.status}</Badge>
                                    </div>
                                    <div className="flex-shrink-0">{config.icon}</div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4 text-sm text-foreground/70">{item.description}</p>
                                <p className="text-xs text-accent">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

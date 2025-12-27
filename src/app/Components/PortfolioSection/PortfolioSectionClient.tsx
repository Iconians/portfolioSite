"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";
import { Badge } from "@/app/Components/ui/badge";
import { Button } from "@/app/Components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import type { PortfolioItem } from "@/lib/types/portfolio";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300 },
  },
};

interface PortfolioSectionClientProps {
  portfolioItems: PortfolioItem[];
}

export function PortfolioSectionClient({
  portfolioItems,
}: PortfolioSectionClientProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {portfolioItems.map((item) => (
        <motion.div
          key={item.id}
          variants={cardVariants}
          whileHover={{ y: -5 }}
        >
          <Card className="overflow-hidden group h-full">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <Image
                width={600}
                height={400}
                src={item.img}
                alt={item.caption}
                className="object-cover w-full h-full transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{item.caption}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.category.map((cat, index) => (
                  <Badge key={index} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                {item.github && item.github !== "#" && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>
                )}
                {item.url && item.url !== "#" && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      website
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

"use client";
import { portfolioItems } from "@/app/utils/PorfolioItems";
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

const PortfolioSection = () => {
  return (
    <section id="projects" className="py-16 scroll-mt-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Projects</h2>
      <p className="text-muted-foreground mb-12 text-lg">
        Professional client work and personal projects showcasing full-stack
        development
      </p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {portfolioItems.map((item) => (
          <motion.div
            key={item.key}
            variants={cardVariants}
            whileHover={{ y: -5 }}
          >
            <Card
              className="overflow-hidden group h-full"
            >
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
                  {item.desc}
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
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PortfolioSection;

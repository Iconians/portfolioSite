"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  title: string;
  description?: string;
  date?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
}

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogCard({
  title,
  description,
  date,
  coverImageUrl,
  coverImageAlt,
}: BlogCardProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group h-full cursor-pointer overflow-hidden transition-all hover:border-primary hover:shadow-lg">
        {coverImageUrl ? (
          <div className="relative aspect-[16/9] bg-muted">
            <Image
              src={coverImageUrl}
              alt={coverImageAlt || title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
        ) : null}
        <CardHeader>
          <CardTitle className="text-xl transition-colors group-hover:text-primary">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {description && (
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
          {date && (
            <small className="text-xs text-muted-foreground">{date}</small>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

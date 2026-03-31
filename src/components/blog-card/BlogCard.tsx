"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  title: string;
  description?: string;
  date?: string;
}

const item = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogCard({ title, description, date }: BlogCardProps) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-lg">
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

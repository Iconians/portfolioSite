"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/Components/ui/card";

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
      <Card className="group hover:border-primary transition-all hover:shadow-lg h-full cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {description && (
            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              {description}
            </p>
          )}
          {date && (
            <small className="text-muted-foreground text-xs">{date}</small>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

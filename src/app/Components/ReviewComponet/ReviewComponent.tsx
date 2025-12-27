import { getAllReviews } from "@/lib/data/reviews";
import { Card } from "@/app/Components/ui/card";
import { Quote } from "lucide-react";

export const ReviewComponent = async () => {
  const reviews = await getAllReviews();

  return (
    <section id="reviews" className="py-20">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          Client Reviews
        </h2>
        <p className="text-muted-foreground text-lg">
          What clients say about working with me
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((item) => (
          <Card
            key={item.id}
            className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
          >
            <Quote className="w-8 h-8 text-primary/40 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-foreground/90 mb-4 leading-relaxed text-sm">
              {item.content}
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <div className="text-yellow-400 text-lg">
                {"★".repeat(item.stars)}
                {"☆".repeat(5 - item.stars)}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

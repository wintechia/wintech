"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { ScrollAnimation } from "@/components/scroll-animation";
import { TESTIMONIALS } from "@/lib/constants";

const AVATARS: Record<string, string> = {
  "Dra. María Fernanda": "/images/testimonials/maria-fernanda.svg",
  "Carlos Andrés Gómez": "/images/testimonials/carlos-gomez.svg",
  "Ana Lucía Restrepo": "/images/testimonials/ana-lucia.svg",
};

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <ScrollAnimation>
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-wintech-dark tracking-tight mb-4">
              Lo que Dicen <span className="text-wintech-cyan">Nuestros Clientes</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Resultados reales de negocios que ya multiplicaron sus ventas con WinTech AI.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(TESTIMONIALS ?? []).map((testimonial: any, i: number) => (
            <ScrollAnimation key={i} delay={i * 0.15}>
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial?.rating ?? 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-wintech-cyan/20 mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">
                  "{testimonial?.text ?? ""}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src={AVATARS[testimonial?.name ?? ""] || "/images/testimonials/maria-fernanda.svg"}
                      alt={testimonial?.name ?? ""}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-display font-bold text-sm text-wintech-dark">
                      {testimonial?.name ?? ""}
                    </p>
                    <p className="text-gray-500 text-xs">{testimonial?.role ?? ""}</p>
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
}

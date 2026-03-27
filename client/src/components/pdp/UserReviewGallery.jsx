import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Modal } from '../ui/Modal';

// Mock Cloudinary CDN URLs for user-uploaded images
const USER_IMAGES = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80',
  'https://images.unsplash.com/photo-1509631179647-0c71a3db616b?w=600&q=80',
  'https://images.unsplash.com/photo-1485230895905-efd543505cff?w=600&q=80',
  'https://images.unsplash.com/photo-1434389674669-e08b4cac3105?w=600&q=80',
  'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=600&q=80',
  'https://images.unsplash.com/photo-1550614000-4b95f27fe813?w=600&q=80',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80',
];

export function UserReviewGallery() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="mt-12 lg:mt-20 border-t border-zinc-200 pt-8 lg:pt-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-2">
            Styled by You
          </h2>
          
          {/* Review Count Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-zinc-900 font-semibold bg-zinc-100 px-3 py-1.5 rounded-full text-sm">
              <Star className="w-4 h-4 text-violet-600 fill-violet-600 mr-1.5" />
              4.8 <span className="text-zinc-500 font-normal ml-1">/ 5.0</span>
            </div>
            <span className="text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 cursor-pointer hover:text-zinc-900 transition-colors">
              Based on 124 reviews
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm font-semibold text-zinc-900 hover:text-violet-600 transition-colors border-b border-zinc-900 hover:border-violet-600 pb-0.5 inline-flex self-start sm:self-auto"
        >
          View All Gallery
        </button>
      </div>

      {/* Horizontal Snap Scroll Carousel */}
      <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex overflow-x-auto gap-3 sm:gap-4 snap-x snap-mandatory hide-scrollbar pb-4">
          {USER_IMAGES.map((src, idx) => (
            <div
              key={idx}
              className="relative shrink-0 w-[60vw] sm:w-[280px] md:w-[300px] aspect-[4/5] snap-start group cursor-pointer overflow-hidden rounded-2xl bg-zinc-100"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={src}
                alt={`User styled image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Expandable 3x3 Grid Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="lg"
        title="Community Gallery"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 p-1">
          {USER_IMAGES.map((src, idx) => (
            <div
              key={`modal-img-${idx}`}
              className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100"
            >
              <img
                src={src}
                alt={`User styled image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Modal>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}

"use client";

import { useState } from "react";
import { Review } from "../data/reviews";

function Stars({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type={interactive ? "button" : undefined}
          onClick={() => interactive && onRate?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={`text-lg leading-none ${interactive ? "cursor-pointer" : "cursor-default"} transition-transform ${interactive && s <= (hover || rating) ? "scale-110" : ""}`}
        >
          <span className={(hover || rating) >= s ? "text-yellow-400" : "text-gray-200"}>★</span>
        </button>
      ))}
    </div>
  );
}

function avgRating(reviews: Review[]) {
  if (!reviews.length) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

export default function ReviewSection({ dealerId, dealerType, reviews }: {
  dealerId: number;
  dealerType: "shop" | "service";
  reviews: Review[];
}) {
  const filtered = reviews.filter((r) => r.dealer_id === dealerId && r.dealer_type === dealerType && r.approved);
  const avg = avgRating(filtered);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  }

  return (
    <div className="mt-6 border-t border-gray-100 pt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-gray-900">Reviews</h3>
          {filtered.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Stars rating={Math.round(avg)} />
              <span className="text-sm font-bold text-gray-800">{avg.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({filtered.length})</span>
            </div>
          )}
        </div>
        {!showForm && !submitted && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs font-semibold text-green-600 hover:underline"
          >
            + Lër review
          </button>
        )}
      </div>

      {/* Lista reviews */}
      {filtered.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 mb-3">Asnjë review ende. Bëhu i pari!</p>
      )}
      <div className="flex flex-col gap-3 mb-4">
        {filtered.map((r) => (
          <div key={r.id} className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">{r.user_name}</span>
                <Stars rating={r.rating} />
              </div>
              <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString("sq-AL")}</span>
            </div>
            <p className="text-xs text-gray-600">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Forma */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Emri juaj"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Vlerësimi:</span>
            <Stars rating={rating} interactive onRate={setRating} />
          </div>
          <textarea
            required
            rows={3}
            placeholder="Koment juaj..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 resize-none bg-white"
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors">
              Dërgo
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 text-sm text-gray-500 hover:text-gray-700">
              Anulo
            </button>
          </div>
          <p className="text-xs text-gray-400">Review-i do aprovohet nga admini para publikimit.</p>
        </form>
      )}

      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 font-medium">
          ✅ Faleminderit! Review-i u dërgua dhe pret aprovimin.
        </div>
      )}
    </div>
  );
}

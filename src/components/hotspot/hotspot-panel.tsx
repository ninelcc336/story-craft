"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TopicCard } from "./topic-card";
import { AngleList } from "./angle-list";
import { Loader2, RefreshCw, TrendingUp } from "lucide-react";
import type { HotTopic, StoryAngle, HotspotCategory } from "@/types/hotspot";
import { HOTSPOT_CATEGORIES } from "@/types/hotspot";

interface HotspotPanelProps {
  onSelectAngle: (sampleTopic: string, style: string) => void;
}

export function HotspotPanel({ onSelectAngle }: HotspotPanelProps) {
  const [topics, setTopics] = useState<HotTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<HotTopic | null>(null);
  const [angles, setAngles] = useState<StoryAngle[]>([]);
  const [selectedAngleId, setSelectedAngleId] = useState<string | null>(null);
  const [isLoadingTrends, setIsLoadingTrends] = useState(false);
  const [isLoadingAngles, setIsLoadingAngles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<HotspotCategory | "全部">("全部");

  const fetchTrends = async (category?: HotspotCategory) => {
    setIsLoadingTrends(true);
    setError(null);
    setSelectedTopic(null);
    setAngles([]);
    try {
      const params = category ? `?category=${category}` : "";
      const res = await fetch(`/api/hotspot/trends${params}`);
      const json = await res.json();
      if (json.success) {
        setTopics(json.data.trends);
      } else {
        setError(json.message || "获取热点失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoadingTrends(false);
    }
  };

  const fetchAngles = async (topic: HotTopic) => {
    setSelectedTopic(topic);
    setIsLoadingAngles(true);
    setError(null);
    setSelectedAngleId(null);
    try {
      const res = await fetch("/api/hotspot/angles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const json = await res.json();
      if (json.success) {
        setAngles(json.data.angles);
      } else {
        setError(json.message || "获取角度推荐失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoadingAngles(false);
    }
  };

  const handleSelectAngle = (angle: StoryAngle) => {
    setSelectedAngleId(angle.id);
    onSelectAngle(angle.sampleTopic, angle.suggestedStyle);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            热点雷达
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <div className="flex gap-1">
            {(["全部", ...HOTSPOT_CATEGORIES.slice(0, 5)] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  fetchTrends(cat === "全部" ? undefined : cat as HotspotCategory);
                }}
                className={`rounded px-2 py-0.5 text-xs transition-colors ${
                  categoryFilter === cat
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTrends(categoryFilter === "全部" ? undefined : categoryFilter)}
            disabled={isLoadingTrends}
          >
            {isLoadingTrends ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="mr-1 h-3 w-3" />
            )}
            刷新热点
          </Button>
        </div>
      </div>

      <Separator />

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading / Empty */}
      {isLoadingTrends ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-8 text-sm text-gray-400">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          AI 正在分析当前热门话题...
        </div>
      ) : topics.length === 0 && !error ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
          <p>点击"刷新热点"获取当前热门话题</p>
          <p className="mt-1 text-xs">AI 将分析各平台热搜并推荐适合故事化创作的话题</p>
        </div>
      ) : (
        <>
          {/* Topic Grid */}
          <div className="grid grid-cols-2 gap-2">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isSelected={selectedTopic?.id === topic.id}
                onClick={() => fetchAngles(topic)}
                disabled={isLoadingAngles}
              />
            ))}
          </div>

          {/* Angle Recommendations */}
          {isLoadingAngles && (
            <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-200 py-6 text-sm text-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI 正在推荐故事切入角度...
            </div>
          )}

          {angles.length > 0 && selectedTopic && (
            <AngleList
              angles={angles}
              isSelected={selectedAngleId || undefined}
              onSelect={handleSelectAngle}
              onRefresh={() => fetchAngles(selectedTopic)}
              isRefreshing={isLoadingAngles}
            />
          )}
        </>
      )}
    </div>
  );
}

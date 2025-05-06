"use client";

import React, { use } from "react";
import { DiscussionCategoryView } from "@/components/DiscussionForums/category/DiscussionCategoryView";

export default function DiscussionCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolveParams = use(params);
  const category = resolveParams.category;

  return <DiscussionCategoryView category={category} />;
}

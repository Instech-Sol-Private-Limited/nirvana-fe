"use client";

import Link from "next/link";
import React, { use } from "react";
import { DiscussionByIDView } from "@/components/DiscussionForums/category/id";

export default function Pages({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const resolveParams = use(params);
  const id = resolveParams.id;
  const category = resolveParams.category;

  return <DiscussionByIDView id={id} category={category} />;
}

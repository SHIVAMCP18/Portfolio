import { NextRequest, NextResponse } from "next/server";
import { assistantKnowledge } from "@/data/assistant-knowledge";

function getAssistantReply(message: string) {
  const text = message.toLowerCase();

  if (
    text.includes("who are you") ||
    text.includes("tell me about shivam") ||
    text.includes("shivam") ||
    text.includes("intro") ||
    text.includes("about")
  ) {
    return assistantKnowledge.intro;
  }

  if (
    text.includes("skill") ||
    text.includes("tech stack") ||
    text.includes("technology") ||
    text.includes("technologies") ||
    text.includes("languages")
  ) {
    return `Shivam works with ${assistantKnowledge.skills.join(", ")}.`;
  }

  if (text.includes("adani")) {
    return assistantKnowledge.experience.adani;
  }

  if (text.includes("disha")) {
    return assistantKnowledge.experience.disha;
  }

  if (text.includes("nexus")) {
    return assistantKnowledge.experience.nexus;
  }

  if (text.includes("maruti")) {
    return assistantKnowledge.experience.maruti;
  }

  if (
    text.includes("internship") ||
    text.includes("experience") ||
    text.includes("work")
  ) {
    return `Shivam has completed 4 software engineering internships at Adani Group, Disha Enterprise, Nexus Software, and Maruti Enterprise across full-stack development, microservices, cloud engineering, data pipelines, and systems debugging.`;
  }

  if (
    text.includes("flowforge") ||
    text.includes("dag") ||
    text.includes("orchestrat")
  ) {
    return assistantKnowledge.projects.flowforge;
  }

  if (
    text.includes("streaming") ||
    text.includes("dataflow") ||
    text.includes("beam") ||
    text.includes("pub/sub") ||
    text.includes("bigquery")
  ) {
    return assistantKnowledge.projects.streamingAnalytics;
  }

  if (
    text.includes("voiceiq") ||
    text.includes("intelligence") ||
    text.includes("customer") ||
    text.includes("rag") ||
    text.includes("pgvector")
  ) {
    return assistantKnowledge.projects.voiceiq;
  }

  if (
    text.includes("webhook") ||
    text.includes("idempotency")
  ) {
    return assistantKnowledge.projects.webhookDelivery;
  }

  if (
    text.includes("zentry") ||
    text.includes("gaming") ||
    text.includes("gemini")
  ) {
    return assistantKnowledge.projects.zentry;
  }

  if (
    text.includes("raindrop") ||
    text.includes("deraindrop") ||
    text.includes("gan") ||
    text.includes("vision") ||
    text.includes("cv")
  ) {
    return assistantKnowledge.projects.deraindrop;
  }

  if (
    text.includes("achievement") ||
    text.includes("award") ||
    text.includes("rank") ||
    text.includes("google") ||
    text.includes("flipkart") ||
    text.includes("nasa")
  ) {
    return assistantKnowledge.achievements;
  }

  if (
    text.includes("leadership") ||
    text.includes("ieee") ||
    text.includes("aces") ||
    text.includes("nirma") ||
    text.includes("head")
  ) {
    return assistantKnowledge.leadership;
  }

  if (
    text.includes("contact") ||
    text.includes("email") ||
    text.includes("phone") ||
    text.includes("linkedin") ||
    text.includes("github") ||
    text.includes("hire") ||
    text.includes("tokyo")
  ) {
    return assistantKnowledge.contact;
  }

  return "I can help with Shivam's internships (Adani, Disha, Nexus, Maruti), 18 projects (FlowForge, VoiceIQ, Streaming Pipeline, Zentry, etc.), tech stack, achievements, and contact details. Try asking about his distributed systems work, his internships, or his AI/ML projects!";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message ?? "";

    const reply = getAssistantReply(message);

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Something went wrong while answering that question." },
      { status: 500 }
    );
  }
}

"use client";

import { Calendar, ChevronRight, Edit, Home, Trash, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { deleteArticleForm } from "@/app/actions/articles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ViewerArticle {
  title: string;
  author: string | null;
  id: number;
  content: string;
  createdAt: string;
  imageUrl?: string | null;
}

interface WikiArticleViewerProps {
  article: ViewerArticle;
  canEdit?: boolean;
  pageviews?: number | null;
}

export default function WikiArticleViewer({
  article,
  canEdit = false,
}: WikiArticleViewerProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mx-auto px-4 py-8 max-w-4xl container">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 mb-6 text-muted-foreground text-sm">
        <Link
          href="/"
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="mr-1 w-4 h-4" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="font-medium text-foreground">{article.title}</span>
      </nav>

      {/* Article Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="mb-4 font-bold text-foreground text-4xl">
            {article.title}
          </h1>

          {/* Article Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center">
              <User className="mr-1 w-4 h-4" />
              <span>By {article.author ?? "Unknown"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Badge variant="secondary">Article</Badge>
            </div>
          </div>
        </div>

        {/* Edit Button - Only shown if user has edit permissions */}
        {canEdit && (
          <div className="flex items-center gap-2 ml-4">
            <Link href={`/wiki/edit/${article.id}`} className="cursor-pointer">
              <Button variant="outline" className="cursor-pointer">
                <Edit className="mr-2 w-4 h-4" />
                Edit Article
              </Button>
            </Link>

            {/* Delete form calls the server action wrapper */}
            <form action={deleteArticleForm}>
              <input type="hidden" name="id" value={String(article.id)} />
              <Button
                type="submit"
                variant="destructive"
                className="ml-2 cursor-pointer"
              >
                <Trash className="mr-2 w-4 h-4" />
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-6">
          {/* Article Image - Display if exists */}
          {article.imageUrl && (
            <div className="mb-8">
              <div className="relative rounded-lg w-full h-64 md:h-80 overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={`Image for ${article.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Rendered Markdown Content */}
          <div className="dark:prose-invert max-w-none prose prose-stone">
            <ReactMarkdown
              components={{
                // Customize heading styles
                h1: ({ children }) => (
                  <h1 className="mt-8 mb-4 font-bold text-foreground text-3xl">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-6 mb-3 font-semibold text-foreground text-2xl">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-4 mb-2 font-semibold text-foreground text-xl">
                    {children}
                  </h3>
                ),
                // Customize paragraph styles
                p: ({ children }) => (
                  <p className="mb-4 text-foreground leading-7">{children}</p>
                ),
                // Customize list styles
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 text-foreground list-disc">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 text-foreground list-decimal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-foreground">{children}</li>
                ),
                // Customize code styles
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted mb-4 p-4 rounded-lg overflow-x-auto text-sm">
                    {children}
                  </pre>
                ),
                // Customize blockquote styles
                blockquote: ({ children }) => (
                  <blockquote className="my-4 pl-4 border-muted-foreground border-l-4 text-muted-foreground italic">
                    {children}
                  </blockquote>
                ),
                // Customize link styles
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="font-medium text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                // Customize table styles
                table: ({ children }) => (
                  <div className="mb-4 overflow-x-auto">
                    <table className="border border-border min-w-full border-collapse">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-muted px-4 py-2 border border-border font-semibold text-left">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-2 border border-border">{children}</td>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex justify-between items-center mt-8">
        <Link href="/">
          <Button variant="outline">← Back to Articles</Button>
        </Link>

        {canEdit && (
          <div className="flex items-center gap-2">
            <Link href={`/wiki/edit/${article.id}`} className="cursor-pointer">
              <Button className="cursor-pointer">
                <Edit className="mr-2 w-4 h-4" />
                Edit This Article
              </Button>
            </Link>

            <form action={deleteArticleForm}>
              <input type="hidden" name="id" value={String(article.id)} />
              <Button
                type="submit"
                variant="destructive"
                className="cursor-pointer"
              >
                <Trash className="mr-2 w-4 h-4" />
                Delete
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
